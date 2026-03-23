# HueProTab

HueProTab is a Philips Hue dashboard project that compiles modular source files into a single `dist/index.html` artifact for Chrome on Windows 10 and Android.

## Current focus

This repository is currently building the first implementation PR: a strong foundation with a clean folder structure, a single-file build pipeline, and placeholder app modules that later frontend and Hue-service work can plug into.

## Project structure

- `src/html/` — shell, view templates, and component fragments
- `src/css/` — tokens, base styles, layout rules, and component styling
- `src/js/` — app bootstrap plus state, service, and UI modules
- `scripts/` — build and validation helpers
- `tests/` — build, state, and UI tests
- `dist/` — generated single-file output

## Commands

- `npm run build` — generate `dist/index.html`
- `npm test` — run the current Node test suite
- `npm run validate` — validate the generated artifact shape

## Planning docs

- Design spec: `docs/superpowers/specs/2026-03-23-hueprotab-design.md`
- Implementation plan: `docs/superpowers/plans/2026-03-23-hueprotab-implementation.md`
