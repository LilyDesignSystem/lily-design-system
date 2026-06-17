# Changelog — LocaleSelect (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `locale-select.component.ts` — Angular 20 standalone component.
  Implements the full Svelte canonical contract:
  - Renders `<select [attr.aria-label]="…" [name]="…">` with one
    `<option [attr.lang]="tagFor(locale)">` per locale code per
    WCAG 3.1.2 (Language of Parts).
  - Sets `lang="{bcp47LocaleTag(code)}"` on the resolved target
    element (defaults to `document.documentElement`).
  - Sets `dir="rtl"` / `dir="ltr"` on the target element via
    `isRtlLocale()` auto-detection. Opt-out via
    `[applyDir]="false"`.
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `detectFromNavigator` first-visit fallback via
    `navigator.languages`.
  - Two-way binding via `[(value)]` (model signal).
  - `localeChange` output for post-apply side effects.
  - `className` input for the consumer's CSS hook on the root
    `<select>`.
- `locales.ts` — 436-row built-in locale-code → English-name table
  plus RTL language and script subtag sets. Byte-identical to the
  Svelte / Vue canonical helpers (framework-agnostic data).
- `locales.tsv` — canonical source for `locales.ts`. Byte-identical
  to the Svelte / Vue canonical helpers.
- `index.ts` barrel re-exporting `LocaleSelect`, `bcp47LocaleTag`,
  `isRtlLocale`, `localeName`, `matchNavigatorLanguage`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`.
- `locale-select.component.spec.ts` — vitest suite asserting every
  numbered acceptance criterion in `spec.md` §7 (23 items).
- `spec.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `bcp47.md`, `concepts.md`, `i18n-integration.md`, `rtl.md`,
  `ssr.md`.
- `examples/` subdirectory: `01-radios.component.ts`,
  `02-select.component.ts`, `03-buttons.component.ts`,
  `04-rtl-demo.component.ts`, `05-nhs-style.component.ts`,
  `06-with-transloco.component.ts`,
  `07-with-ngx-translate.component.ts`,
  `08-ssr-cookie.component.ts`, `09-scoped-target.component.ts`,
  `10-combobox.component.ts`, plus a `README.md` index.

### Conventions

- Angular 20 standalone component, `OnPush`, `@for` control flow.
- Signal inputs (`input<T>()`, `input.required<T>()`), model signal
  for `value`, signal output for `localeChange`.
- Template-inline only (no `templateUrl`, `styles`, `styleUrls`).
- Template-cast pattern: `$any($event.target).value`.
- Zero runtime dependencies beyond `@angular/core` and
  `@angular/common`.
- SSR-safe: all DOM writes inside `effect()` and guarded by
  `typeof document !== "undefined"`.
- Tested under vitest + jsdom + `@angular/core/testing` `TestBed`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-select` v0.1.0. The DOM
contract, BCP 47 normalisation rules, RTL detection sets,
initial-value resolution order, and apply order match
clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `localeChange` Angular output. Use `(localeChange)="..."`
  in templates.
- The `children` snippet from Svelte does not yet have an Angular
  equivalent — content projection via `<ng-content>` and
  `@ContentChild(TemplateRef)` is planned. The v0.1.0 workaround is
  a sibling widget bound to the same `[(value)]` signal (see
  `examples/02-select.component.ts`, `03-buttons.component.ts`,
  `10-combobox.component.ts`).
- The bindable model name is `value`, not the legacy `value`
  decorator name. Use `[(value)]="locale"` and not
  `[(modelValue)]="locale"`.
- `target` accepts an `HTMLElement` or `null`; templates pass a
  template ref's `nativeElement` (`[target]="panel.nativeElement"`).

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
