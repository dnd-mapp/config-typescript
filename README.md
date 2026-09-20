# @dnd-mapp/config-typescript

[![npm version](https://img.shields.io/npm/v/@dnd-mapp/config-typescript)](https://www.npmjs.com/package/@dnd-mapp/config-typescript)
[![license](https://img.shields.io/npm/l/@dnd-mapp/config-typescript)](LICENSE)

Shared, reusable TypeScript configs (tsconfig bases) for all D&D Mapp projects.

## Requirements

- TypeScript 6 is a peer dependency and must be installed in your project.

## Installation

```bash
pnpm add --save-dev typescript @dnd-mapp/config-typescript
```

## Usage

Extend a config from your `tsconfig.json`. Add the options that depend on your environment, such as `target`, `module`, and `lib`, in your own config.

```json
{
    "extends": "@dnd-mapp/config-typescript/base",
    "include": ["src"],
    "compilerOptions": {
        "target": "es2025",
        "module": "nodenext"
    }
}
```

## Available configs

| Config | Extends path                       | Description                                              |
|:-------|:-----------------------------------|:---------------------------------------------------------|
| `base` | `@dnd-mapp/config-typescript/base` | Strict, environment-independent defaults for any project |

Each config is also available with the `.json` extension, for example `@dnd-mapp/config-typescript/base.json`.

## What `base` configures

The `base` config is meant to work in any kind of project, so it leaves out anything that depends on the runtime or the build setup.

- **Strictness:** Enables `strict` plus extra checks such as `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, and `noPropertyAccessFromIndexSignature`.
- **Cleanliness:** Turns unused locals, unused parameters, unreachable code, unused labels, and switch fallthrough into errors.
- **Module safety:** Enables `isolatedModules` and `moduleDetection: "force"` so every file works with single-file transpilers and is treated as a module. Also enables `esModuleInterop`.
- **Output and diagnostics:** Uses LF line endings, disables error truncation, and skips type checking of declaration files with `skipLibCheck`.

It does not set `target`, `module`, `moduleResolution`, `lib`, `types`, `jsx`, or any emit and path options. It also relies on the TypeScript 6 defaults for `noUncheckedSideEffectImports`.

## Changelog

Notable changes for consumers of this package are listed in the [changelog](CHANGELOG.md).

## Contributing

Contributions are welcome. See the [contributing guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) © D&D Mapp
