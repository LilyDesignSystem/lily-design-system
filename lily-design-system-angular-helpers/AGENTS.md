# AGENTS — Lily Angular Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-angular-theme-chooser`](./lily-design-system-angular-theme-chooser/) — dynamic theme CSS loader.
- [`lily-design-system-angular-locale-chooser`](./lily-design-system-angular-locale-chooser/) — `lang` + `dir` locale chooser.
- [`lily-design-system-angular-text-size-chooser`](./lily-design-system-angular-text-size-chooser/) — `data-text-size` text-size chooser.
- [`lily-design-system-angular-share-chooser`](./lily-design-system-angular-share-chooser/) — share via the native sheet or a list of consumer-supplied destinations, plus copy-the-URL. Owns an *action*, not a preference: applies nothing, persists nothing.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
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
