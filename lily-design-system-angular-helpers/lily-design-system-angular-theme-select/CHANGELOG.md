# Changelog — ThemeSelect (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `theme-select.component.ts` — Angular 20 standalone component.
  Implements the full Svelte canonical contract:
  - Renders `<select class="theme-select …" [attr.aria-label]="…"
    [name]="…">` with one `<option class="theme-select-option">`
    per theme slug.
  - Manages a single `<link rel="stylesheet"
    data-lily-theme-select="{name}">` in `document.head` and swaps
    its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `[(value)]` (model signal).
  - `themeChange` output for post-apply side effects.
  - `className` input for the consumer's CSS hook on the root
    `<select>`.
- `index.ts` barrel re-exporting `ThemeSelect`, `normaliseThemesUrl`,
  `themeHref`.
- `theme-select.component.spec.ts` — vitest suite asserting every
  numbered acceptance criterion in `spec.md` §7 (13 items + extras).
- `spec.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `props-reference.md`,
  `recipes.md`, `ssr.md` (Analog notes), `styling.md`,
  `troubleshooting.md`.
- `examples/` subdirectory: `basic.component.ts`,
  `custom-labels.component.ts`, `custom-rendering.component.ts`,
  `lily-themes.component.ts`, `multiple-pickers.component.ts`,
  `persistence.component.ts`, `preloaded.component.ts`,
  `system-preference.component.ts`, `two-way-binding.component.ts`,
  plus `analog-cookie/` with `app.component.ts`,
  `app.config.server.ts`, `tokens/initial-theme.ts`,
  `server/middleware/theme.ts`, `server/routes/api/theme.post.ts`.

### Conventions

- Angular 20 standalone component, `OnPush`, `@for` control flow.
- Signal inputs (`input<T>()`, `input.required<T>()`), model signal
  for `value`, signal output for `themeChange`.
- Template-inline only (no `templateUrl`, `styles`, `styleUrls`).
- Template-cast pattern: `$any($event.target).value`.
- Zero runtime dependencies beyond `@angular/core` and
  `@angular/common`.
- SSR-safe: all DOM writes inside `effect()` and guarded by
  `typeof document !== "undefined"`.
- Tested under vitest + jsdom + `@angular/core/testing` `TestBed`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `themeChange` Angular output. Use `(themeChange)="..."` in
  templates.
- The `children` snippet from Svelte does not yet have an Angular
  equivalent — content projection via `<ng-content>` and
  `@ContentChild(TemplateRef)` is planned. See
  `docs/custom-rendering.md`.
- The `class` consumer hook from Svelte maps to the `className`
  input in Angular (Angular has no implicit attribute
  fall-through).

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
