# Contributing

Thank you for your interest in contributing to `@dnd-mapp/config-typescript`.

This package is the shared TypeScript base for all D&D Mapp projects. A change here affects every project that extends it, so please keep changes small and deliberate.

## Before you start

Open an [issue](https://github.com/dnd-mapp/config-typescript/issues) to discuss any change beyond a typo fix before you send a pull request. This avoids work on changes that do not fit the goals of the package.

## Development setup

The required tool versions are enforced through `devEngines` and `engineStrict`, so installing with other versions fails.

- Node `24.21.0`
- pnpm `12.5.1`

Install the dependencies with:

```bash
pnpm install
```

Dependency versions live in the `catalog` in `pnpm-workspace.yaml`, which uses `catalogMode: strict`. Add or bump versions there and reference them with `catalog:` in `package.json`.

Newly published releases are held back for three days through `minimumReleaseAge`. You may need to wait before you can bump to a very recent version.

## Checks

CI runs these checks on every pull request. Run them locally before you push.

| Script                  | Purpose                                              |
|:------------------------|:-----------------------------------------------------|
| `pnpm run format-check` | Checks formatting with Prettier                      |
| `pnpm run typecheck`    | Type-checks the tooling files with `tsc`             |
| `pnpm run lint-md`      | Lints Markdown with markdownlint-cli2                |

Run `pnpm run format` to fix formatting issues.

## Changing or adding a config

Configs live in `configs/*.json`. The `exports` map in `package.json` exposes each file with and without the `.json` extension.

Keep every config independent of the environment. Do not set `target`, `module`, `moduleResolution`, `lib`, `types`, `jsx`, or any emit and path options. Consumers add these in their own `tsconfig.json`.

When you add or change an option, update the README in the same pull request.

- Update the "Available configs" table when you add a config.
- Update the "What `base` configures" section when you change the options of `base`.

## Changelog and versioning

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Record every notable change for consumers under `[Unreleased]` in `CHANGELOG.md`, using the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

Enabling a stricter option can make existing consumer projects fail to compile. Treat it as a breaking change and say so in the changelog entry.

## Releasing

1. Open a pull request with a single `chore: release X.Y.Z` commit. It sets `version` in `package.json`, renames `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD`, adds a fresh `[Unreleased]`, and updates the link references.
2. Merge it, then create an annotated tag `vX.Y.Z` on the merge commit and push the tag.
3. The [release workflow](.github/workflows/release.yaml) runs the CI checks, verifies the tag and the changelog, stages the package on npm, and creates the GitHub Release.
4. Find the staged version with `pnpm stage list` and approve it with `pnpm stage approve <id>` and 2FA.

If the staged version is wrong, reject it with `pnpm stage reject <id>`. The same version cannot be staged again until then.

## Code style

Follow the rules in `.editorconfig`.

- Use UTF-8 and LF line endings.
- Indent with 4 spaces, or 2 spaces in `package.json`.
- End every file with a newline and trim trailing whitespace.

Follow these rules for prose, including Markdown files.

- Never hard wrap prose. Write each paragraph or list item on a single line.
- Use US spelling, for example "color" and "behavior".
- Keep every sentence at or under 40 words.
- Pretty print Markdown tables so the columns line up, with alignment markers on every separator line.

## Branches

Create a branch from `main` for each change. Name it `<type>/<short-description>` in lowercase with hyphens between words, for example `feat/add-node-config` or `fix/base-lib-option`.

Use the same types as for commits.

## Commits

Write commit messages that follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```text
<type>(<optional scope>): <description>
```

Use one of these types.

| Type       | Use for                                           |
|:-----------|:--------------------------------------------------|
| `feat`     | A new config or a new compiler option             |
| `fix`      | A correction to an existing config or option      |
| `docs`     | Changes to documentation only                     |
| `refactor` | Changes that do not alter the behavior of configs |
| `build`    | Changes to packaging, dependencies, or tooling    |
| `chore`    | Other maintenance that does not fit above         |

Write the description in the imperative mood, such as "add node config". Mark a breaking change with `!` after the type or scope, and add a `BREAKING CHANGE:` footer that explains what consumers must do.

## Pull requests

- Keep each pull request to one change.
- Link the issue it addresses.
- Update the changelog and README in the same pull request.
- Use a title that follows the commit convention.

## License

By contributing, you agree that your contributions are licensed under the [MIT license](LICENSE).
