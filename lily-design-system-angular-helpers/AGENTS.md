# AGENTS — Lily Angular Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-angular-theme-picker`](./lily-design-system-angular-theme-picker/) — dynamic theme CSS loader.
- [`lily-design-system-angular-locale-picker`](./lily-design-system-angular-locale-picker/) — `lang` + `dir` locale picker.

## Working rules

- Treat each helper's `spec.md` as the single source of truth.
- Match the upstream Angular conventions in
  [`../lily-design-system-angular-headless/AGENTS.md`](../lily-design-system-angular-headless/AGENTS.md)
  where they apply: standalone components, signal-based inputs,
  `OnPush`, `@for` control flow, no CSS, no NgModules.
- The template-cast pattern is **`$any($event.target).value`** — not
  `($event.target as HTMLInputElement).value`. Angular's template
  parser rejects parenthesised TS casts inside method calls.
- Tests use vitest + jsdom + `@angular/core/testing` `TestBed`. Built-in
  vitest matchers only; no `@testing-library/jest-dom` sugar.
- No hardcoded user-facing strings; everything comes from props.
