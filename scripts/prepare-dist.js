/**
 * Prepares the `dist` directory that gets published to npm.
 *
 * Copies the files that consumers need and writes a trimmed `package.json` next to them. It runs from the
 * `prepublishOnly` script, and `publishConfig.directory` points the publish at `dist`.
 *
 * The files are first assembled in a staging directory. It replaces `dist` only when every step succeeded, so a
 * failed run never leaves a partial `dist` behind.
 */
import { access, cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** The root directory of the repository. */
const rootDir = join(import.meta.dirname, '..');

/** The directory that gets published. It is replaced on every successful run. */
const distDir = join(rootDir, 'dist');

/** The directory in which `dist` is assembled before it replaces the current one. */
const stagingDir = join(rootDir, '.tmp');

/** Fields of `package.json` that only matter for development and are left out of the published manifest. */
const REMOVED_FIELDS = ['$schema', 'scripts', 'devDependencies', 'devEngines'];

/**
 * The parts of `package.json` that this script reads. Any other field is passed through untouched.
 *
 * @typedef {{ name: string; version: string; exports?: unknown; publishConfig?: { directory?: string }; [field: string]: unknown }} Manifest
 */

/** Files and directories, relative to the repository root, that are copied into `dist` as they are. */
const INCLUDED = ['configs', 'CHANGELOG.md', 'README.md', 'LICENSE'];

/**
 * Runs a function and, when it throws or rejects, rethrows the failure as an error with a descriptive message.
 *
 * The original error is kept as the `cause`. The function may be synchronous or asynchronous.
 *
 * @template T
 * @param {string} message The message of the error to throw on failure.
 * @param {() => T} fn The function to run.
 * @returns {Promise<Awaited<T>>} The value that `fn` returned, or resolved to.
 * @throws {Error} When `fn` throws or rejects.
 */
async function withContext(message, fn) {
    try {
        return await fn();
    } catch (error) {
        throw new Error(message, { cause: error });
    }
}

/**
 * Reads the manifest of the repository and strips what should not be published.
 *
 * Removes the development fields and `publishConfig.directory`.
 *
 * @returns {Promise<Manifest>} The manifest to write to `dist`.
 * @throws {Error} When `package.json` cannot be read or parsed.
 */
async function createPublishManifest() {
    const content = await withContext('Failed to read "package.json"', () =>
        readFile(join(rootDir, 'package.json'), 'utf-8'),
    );
    /** @type {Manifest} */
    const manifest = await withContext('Failed to parse "package.json"', () => JSON.parse(content));

    for (const field of REMOVED_FIELDS) {
        delete manifest[field];
    }
    delete manifest.publishConfig?.directory;

    return manifest;
}

/**
 * Removes a directory and creates it again, so it is empty.
 *
 * @param {string} directory The directory to reset.
 * @returns {Promise<void>}
 * @throws {Error} When the directory cannot be removed or created.
 */
async function resetDirectory(directory) {
    await withContext(`Failed to remove "${directory}"`, () => rm(directory, { recursive: true, force: true }));
    await withContext(`Failed to create "${directory}"`, () => mkdir(directory, { recursive: true }));
}

/**
 * Writes the manifest to `package.json` in the given directory.
 *
 * @param {string} directory The directory to write to.
 * @param {Manifest} manifest The manifest to write.
 * @returns {Promise<void>}
 * @throws {Error} When the file cannot be written.
 */
async function writeManifest(directory, manifest) {
    await withContext(`Failed to write "package.json" to "${directory}"`, () =>
        writeFile(join(directory, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`),
    );
}

/**
 * Copies every entry of {@link INCLUDED} from the repository root into the given directory.
 *
 * The entries are independent of each other, so they are copied in parallel. Every entry is attempted, so a single
 * run reports all the entries that failed.
 *
 * @param {string} directory The directory to copy into.
 * @returns {Promise<void>}
 * @throws {AggregateError} When one or more entries cannot be copied. It holds one error for each failed entry.
 */
async function copyIncluded(directory) {
    const results = await Promise.allSettled(
        INCLUDED.map((entry) =>
            withContext(`Failed to copy "${entry}"`, async () => {
                await cp(join(rootDir, entry), join(directory, entry), { recursive: true });
                console.log(`  Copied "${entry}"`);
            }),
        ),
    );
    const failures = results.filter((result) => result.status === 'rejected').map((result) => result.reason);

    if (failures.length > 0) {
        throw new AggregateError(failures, `Failed to copy ${failures.length} of ${INCLUDED.length} entries`);
    }
}

/**
 * Collects the local file paths that an `exports` field points to.
 *
 * Handles the string, array, and conditions forms. Targets that are not relative paths, or that contain a `*`
 * pattern, cannot be checked for existence and are skipped.
 *
 * @param {unknown} exportsField The value of the `exports` field, or a nested part of it.
 * @returns {string[]} The relative paths, for example `./configs/base.yaml`.
 */
function collectExportTargets(exportsField) {
    if (typeof exportsField === 'string') {
        return exportsField.startsWith('./') && !exportsField.includes('*') ? [exportsField] : [];
    }
    if (exportsField !== null && typeof exportsField === 'object') {
        return Object.values(exportsField).flatMap(collectExportTargets);
    }
    return [];
}

/**
 * Checks that every file that the `exports` field points to exists in the given directory.
 *
 * Every target is checked, so a single run reports all the missing files.
 *
 * @param {string} directory The directory that holds the package to verify.
 * @param {Manifest} manifest The manifest that is published with the package.
 * @returns {Promise<void>}
 * @throws {Error} When one or more targets of `exports` do not exist.
 */
async function verifyExports(directory, manifest) {
    const targets = [...new Set(collectExportTargets(manifest.exports))];
    const results = await Promise.all(
        targets.map((target) =>
            access(join(directory, target)).then(
                () => null,
                () => target,
            ),
        ),
    );
    const missing = results.filter((target) => target !== null);

    if (missing.length > 0) {
        throw new Error(`The exports field points to files that are not published: ${missing.join(', ')}`);
    }
    console.log(`  Verified ${targets.length} export target(s)`);
}

/**
 * Replaces the `dist` directory with the staging directory.
 *
 * @returns {Promise<void>}
 * @throws {Error} When `dist` cannot be removed or the staging directory cannot be moved.
 */
async function replaceDist() {
    await withContext(`Failed to remove "${distDir}"`, () => rm(distDir, { recursive: true, force: true }));
    await withContext(`Failed to move "${stagingDir}" to "${distDir}"`, () => rename(stagingDir, distDir));
}

/**
 * Builds the `dist` directory.
 *
 * Assembles the files in the staging directory first and verifies the `exports` field against them. If a step
 * fails, the staging directory is removed and the existing `dist` is left as it was. The error of the failed step is
 * always the one that gets thrown, even when the cleanup fails as well.
 *
 * @returns {Promise<void>}
 * @throws {Error} When any step fails.
 */
async function prepareDist() {
    console.log('Preparing dist...');
    const manifest = await createPublishManifest();
    console.log(`Read package.json for "${manifest.name}@${manifest.version}"`);

    console.log(`Resetting staging directory "${stagingDir}"`);
    await resetDirectory(stagingDir);

    try {
        console.log('Writing "package.json"');
        await writeManifest(stagingDir, manifest);

        console.log(`Copying ${INCLUDED.length} entries`);
        await copyIncluded(stagingDir);

        console.log('Verifying exports');
        await verifyExports(stagingDir, manifest);

        console.log(`Replacing "${distDir}"`);
        await replaceDist();
    } catch (error) {
        console.error(`Preparing dist failed, removing "${stagingDir}"`);

        await rm(stagingDir, { recursive: true, force: true }).catch((cleanupError) => {
            console.warn(`Could not remove "${stagingDir}": ${cleanupError.message}`);
        });
        throw error;
    }

    console.log('Prepared dist');
}

await prepareDist();
