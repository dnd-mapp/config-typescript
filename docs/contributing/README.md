# Contributing to dnd-mapp/config-typescript

This page adds the details of `dnd-mapp/config-typescript` to the [shared contributing guide](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md). Read that guide first.

This package is the shared TypeScript base for all D&D Mapp projects. A change here affects every project that extends it, so keep changes small and deliberate.

## Checks

On top of the [shared checks](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md#checks), CI runs `typecheck`, which type checks the tooling files with `tsc`. Run it before you open a pull request:

```bash
pnpm run typecheck
```

## Changing or adding a config

Configs live in `configs/*.json`. The `exports` map in `package.json` exposes each file with and without the `.json` extension.

Keep `base` independent of the environment. Do not set `target`, `module`, `moduleResolution`, `lib`, `types`, or `jsx` in it. An environment config, such as `node`, extends `base` and sets only these options.

No config sets emit or path options. Consumers add these in their own `tsconfig.json`.

When you add or change an option, update the README in the same pull request.

- Update the "Available configs" table when you add a config.
- Update the "What `<config>` configures" section of every config whose options you change.

## Changelog and versioning

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Record every notable change for consumers under `[Unreleased]` in `CHANGELOG.md`, using the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

Enabling a stricter option can make existing consumer projects fail to compile. Treat it as a breaking change and say so in the changelog entry.

## Releasing

1. Run the [prepare release workflow](../../.github/workflows/prepare-release.yaml) on `main` with the part of the version to bump, for example `gh workflow run prepare-release.yaml -f bump=minor`. It opens the `chore: release X.Y.Z` pull request with auto-merge on.
2. Review and approve the pull request. Once it merges, the `tag` job of the [push workflow](../../.github/workflows/push-main.yaml) creates the annotated tag `vX.Y.Z` on the merge commit.
3. The [release workflow](../../.github/workflows/release.yaml) runs the CI checks, verifies the tag and the changelog, stages the package on npm, and creates the GitHub Release, which opens a discussion in the Announcements category.
4. Find the staged version with `pnpm stage list` and approve it with `pnpm stage approve <id>` and 2FA.

If the staged version is wrong, reject it with `pnpm stage reject <id>`. The same version cannot be staged again until then.
