# @dnd-mapp/config-typescript

[![npm version](https://img.shields.io/npm/v/@dnd-mapp/config-typescript)](https://www.npmjs.com/package/@dnd-mapp/config-typescript)
[![license](https://img.shields.io/npm/l/@dnd-mapp/config-typescript)](LICENSE)

Shared, reusable TypeScript configs (tsconfig bases).

## Requirements

- TypeScript 6 is a peer dependency and must be installed in your project.

## Installation

```bash
pnpm add --save-dev typescript @dnd-mapp/config-typescript
```

## Usage

Extend a config from your `tsconfig.json`. For a Node.js 24 project, extend `node`.

```json
{
    "extends": "@dnd-mapp/config-typescript/node",
    "include": ["src"]
}
```

For any other environment, extend `base` and add the options that depend on it, such as `target`, `module`, and `lib`.

```json
{
    "extends": "@dnd-mapp/config-typescript/base",
    "include": ["src"],
    "compilerOptions": {
        "target": "es2025",
        "module": "preserve"
    }
}
```

## Available configs

| Config | Extends path                       | Description                                              |
|:-------|:-----------------------------------|:---------------------------------------------------------|
| `base` | `@dnd-mapp/config-typescript/base` | Strict, environment-independent defaults for any project |
| `node` | `@dnd-mapp/config-typescript/node` | `base` plus the environment options for Node.js 24       |

Each config is also available with the `.json` extension, for example `@dnd-mapp/config-typescript/base.json`.

## What `base` configures

The `base` config is meant to work in any kind of project, so it leaves out anything that depends on the runtime or the build setup.

- **Strictness:** Enables `strict` plus extra checks such as `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, and `noPropertyAccessFromIndexSignature`.
- **Cleanliness:** Turns unused locals, unused parameters, unreachable code, unused labels, and switch fallthrough into errors.
- **Module safety:** Enables `isolatedModules` and `moduleDetection: "force"` so every file works with single-file transpilers and is treated as a module. Also enables `esModuleInterop`.
- **Output and diagnostics:** Uses LF line endings, disables error truncation, and skips type checking of declaration files with `skipLibCheck`.

It does not set `target`, `module`, `moduleResolution`, `lib`, `types`, `jsx`, or any emit and path options. It also relies on the TypeScript 6 defaults for `noUncheckedSideEffectImports`.

## What `node` configures

The `node` config extends `base` and adds the options for code that runs on Node.js 24.

| Option   | Value        | Effect                                                                     |
|:---------|:-------------|:---------------------------------------------------------------------------|
| `target` | `es2024`     | Emits syntax that Node.js 24 runs natively                                 |
| `lib`    | `["ES2025"]` | Types the built-in APIs up to ES2025, without DOM types                    |
| `module` | `nodenext`   | Follows the Node.js rules for ES modules and CommonJS, including `exports` |
| `types`  | `["node"]`   | Loads only the Node.js types, so install `@types/node` in your project     |

It does not set any emit or path options, so set `noEmit` or `outDir` in your own config.

## Changelog

Notable changes for consumers of this package are listed in the [changelog](CHANGELOG.md).

## Contributing

Contributions are welcome. See the [contributing guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) © D&D Mapp
