import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const rootDir = join(import.meta.dirname, '..');
const distDir = join(rootDir, 'dist');

const REMOVED_FIELDS = ['$schema', 'scripts', 'devDependencies', 'devEngines'];
const INCLUDED = ['configs', 'CHANGELOG.md', 'README.md', 'LICENSE'];

const manifest = JSON.parse(await readFile(join(rootDir, 'package.json'), 'utf-8'));

for (const field of REMOVED_FIELDS) {
    delete manifest[field];
}
delete manifest.publishConfig.directory;

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await writeFile(join(distDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);

for (const entry of INCLUDED) {
    await cp(join(rootDir, entry), join(distDir, entry), { recursive: true });
}
