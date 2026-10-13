# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-10-13

### Added

- `nestjs` config for NestJS projects built with the Nest CLI and SWC, available as `@dnd-mapp/config-typescript/nestjs`. It extends `node` with the decorator options, `module: "esnext"` with `moduleResolution: "bundler"`, `verbatimModuleSyntax`, and `useDefineForClassFields: false`.

## [1.1.0] - 2026-09-25

### Added

- `node` config for Node.js 24 projects, available as `@dnd-mapp/config-typescript/node`. It extends `base` with `target`, `lib`, `module`, and `types`.

## [1.0.0] - 2026-09-20

### Added

- `base` config with strict, environment-independent compiler options, available as `@dnd-mapp/config-typescript/base`.

[Unreleased]: https://github.com/dnd-mapp/config-typescript/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/dnd-mapp/config-typescript/releases/tag/v1.2.0
[1.1.0]: https://github.com/dnd-mapp/config-typescript/releases/tag/v1.1.0
[1.0.0]: https://github.com/dnd-mapp/config-typescript/releases/tag/v1.0.0
