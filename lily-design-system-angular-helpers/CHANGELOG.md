# Changelog — Lily Design System Angular Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release
time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- **`text-size-select` becomes an icon button + APG listbox.** It was
  deliberately left as a native `<select>` when `theme-select` and
  `locale-select` moved to the icon-button shape; it now joins them, so
  all three helpers in the catalog are structurally identical.
- DOM contract replaced. The root is a `<div class="text-size-select">`
  containing a hidden input (preserving `name` and form participation),
  a `<button class="text-size-select-button">` carrying `aria-label`,
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`, and a
  `<ul class="text-size-select-list" role="listbox">` of
  `<li class="text-size-select-option" role="option">` children. The old
  `<select>` / `<option>` markup and its class hooks are gone — consumer
  CSS targeting them must be rewritten, and the consumer now supplies
  the listbox positioning.
- `className` now lands on the root `<div>`, not the `<select>`.
  `name` now names the hidden input, not the `<select>`.
- The `children` / projected-template slot **replaces the button
  glyph**, not the options, and receives `{ value, open, labelFor }`.
- The component now owns the entire keyboard contract, since there is
  no native control underneath: `ArrowDown` / `ArrowUp` / `Enter` /
  `Space` open (`ArrowUp` starts on the last option), focus moves to
  the list, the cursor is `aria-activedescendant` mirrored to
  `data-active`, arrows clamp rather than wrap, `Home` / `End` jump,
  printable characters typeahead over the labels with a 500 ms buffer,
  `Enter` / `Space` select and refocus the button, `Escape` closes
  unchanged, and `Tab` closes without stealing focus.

### Added

- **Default button glyph `"A"`** (U+0041 LATIN CAPITAL LETTER A),
  exported as `LATIN_CAPITAL_LETTER_A`. A plain letter rather than a
  pictograph: U+1F5DB DECREASE FONT SIZE SYMBOL was the first choice
  but has no real glyph in common font stacks and means *decrease*
  rather than *size*. "A" renders in the page's own font everywhere and
  stays monochrome like theme-select's `◑`.
- **`sizeName(slug)` is exported**, mirroring `themeName` /
  `localeName`. `sizeName("x-large")` returns `"X Large"`, and the
  component's `labelFor` delegates to it so there is one
  implementation. `sizeLabels` entries still override it.
- **`TextSizeSelectIcon`** marker directive
  (`ng-template[lilyTextSizeSelectIcon]`) for typed `let-` variables on
  the projected glyph template, and **`nextTextSizeSelectId`**, the
  SSR-safe module-counter id generator.
- **`docs/accessibility.md`** — roles, the full keyboard contract, and
  the same three tradeoffs the sibling helpers document: the
  accessible name rests entirely on `aria-label`, a hand-rolled
  listbox has weaker assistive-technology support than a native
  `<select>` (which remains the better control for some audiences),
  and the glyph is font-dependent — though "A" is materially safer
  there than a pictograph. Keeps the WCAG 1.4.4 (Resize Text)
  guidance that is this helper's specific concern.
- Test suite grew from 15 to 48 cases, including a keyboard suite
  mirroring the canonical Svelte one.

### Not changed

- `data-text-size` application, `localStorage` persistence, the
  `sizeChange` output, initial-value resolution
  (`value` > storage > `defaultValue` > `"medium"` > `sizes[0]`), and
  SSR safety are all unchanged.
- No detection prop was added: unlike `prefers-color-scheme` for
  themes or `navigator.languages` for locales, there is no OS
  "preferred text size" media query to read.

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.3.0**: both are now
  *placeholder-pinned*. The closed `<select>` always displays a short
  placeholder word ("Theme", "Locale") instead of the active value, so
  the control is only ever as wide as that word rather than as wide as
  the longest option. Each renders a leading placeholder `<option>` with
  an empty value, carrying a new optional `placeholder` prop (defaults
  to the existing `label`, so no user-facing string is hardcoded), and
  pins the element's own selection to it — snapping back after every
  change.
- DOM contract: option count is `choices.length + 1`, the first option's
  value is `""`, and the element's own `value` no longer tracks the
  selection. The bindable `value` prop is the single source of truth.
  Behaviour contracts (DOM application, persistence, SSR safety, i18n)
  are otherwise unchanged.
- `text-size-select` is untouched and stays at **0.1.0**.

### Added

- The compensating status region is now the default pattern in the
  examples and quick-starts: a visible `aria-live="polite"` element
  reporting the active value. It exists because placeholder-pinning
  means the control no longer announces its value to a screen reader;
  each package's `docs/accessibility.md` documents that tradeoff
  honestly rather than treating it as solved.

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.2.0**: migrated from
  the radio-group "picker" rendering to a native `<select>` with
  `<option>` children (landed in-tree 2026-06-17), with renamed packages
  (`*-picker` → `*-select`), changed class hooks, and native `<select>`
  keyboard semantics. Behaviour contracts (DOM application, persistence,
  SSR safety, i18n) are unchanged.

### Added

- `text-size-select` **0.1.0** — native-`<select>` text-size helper that
  sets `data-text-size` on the document root, with optional
  `localStorage` persistence (added 2026-06-17; born select-based, so it
  carries no picker migration).

## 0.1.0 — 2026-06-05

Initial release. Two helpers ported from the Svelte canonical
catalog with the Vue helpers as the stylistic mirror:

### Added

- `lily-design-system-angular-theme-select` v0.1.0 — runtime-loading
  theme select with `data-theme` swap, `<link>`-based stylesheet
  injection, `localStorage` persistence, and a `className` input
  for the consumer's CSS hook. Fully mirrors the Svelte canonical
  contract; 13 acceptance criteria covered.
- `lily-design-system-angular-locale-select` v0.1.0 — BCP 47 locale
  select that writes `lang` and `dir` on the document root, with
  optional `localStorage` persistence and `navigator.languages`
  detection. Built-in 436-row locale-name table and RTL detection.
  23 acceptance criteria covered.
- Parent-level `AGENTS/` with `conventions.md`, `testing.md`,
  `accessibility.md`, `ssr.md`.
- Parent-level `AGENTS/shared/` with `headless-principles.md`,
  `i18n-principles.md`, `theme-principles.md` adapted from the
  Lily-wide root `AGENTS/`.
- Each helper subproject ships `AGENTS/`, `docs/`, and `examples/`
  subdirectories mirroring the Svelte canonical depth.

### Conventions established

- Angular 20 standalone components, `OnPush`, `@for` control flow.
- Signal inputs (`input<T>()`, `input.required<T>()`), signal
  outputs (`output<T>()`), model signals (`model<string>()`).
- Two-way binding via `[(value)]` (custom model name, not the
  Angular default `value`).
- Template-cast pattern: `$any($event.target).value` (not the
  parenthesised TS-cast form).
- Template-inline only: no `templateUrl`, no `styles`, no
  `styleUrls`.
- Zero CSS shipped — consumer styles the kebab-case class hook.
- SSR-safe: all DOM writes inside `effect()` and guarded by
  `typeof document !== "undefined"`.
- Tests use vitest + jsdom + `@angular/core/testing` `TestBed`.

### Differences from the Svelte canonical

| Concept                 | Svelte canonical                       | Angular port                            |
| ----------------------- | -------------------------------------- | --------------------------------------- |
| Two-way binding         | `bind:value`                           | `[(value)]`                             |
| Reactive state          | `$state`, `$bindable`                  | `signal()`, `model()`                   |
| Reactive side-effects   | `$effect`                              | `effect()`                              |
| Custom rendering        | Snippet (`{#snippet children(...)}`)   | `ng-content` (future); `className` for class extension only today |
| Stylesheet head         | `<svelte:head>`                        | Imperative `document.head.appendChild` inside `effect()` |
| Cookie / SSR            | `hooks.server.ts` + `transformPageChunk` | Analog server middleware + injection token |
| Storybook integration   | `*.stories.svelte`                     | `*.stories.ts` (`@storybook/angular`)   |
| File ext for components | `.svelte`                              | `.component.ts`                         |
| Control flow            | `{#each}` / `{#if}`                    | `@for` / `@if`                          |
| Event reading           | `event.target.value` (TS)              | `$any($event.target).value` (template)  |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause.

### Differences from the Vue port

| Concept                  | Vue port                          | Angular port                            |
| ------------------------ | --------------------------------- | --------------------------------------- |
| Two-way binding          | `v-model:value`                   | `[(value)]`                             |
| Reactive primitives      | `ref()`, `defineModel()`          | `signal()`, `model()`                   |
| Side-effect scheduling   | `onMounted` + `watch`             | `effect()` (single primitive)           |
| Render-prop equivalent   | Default scoped slot               | `className` + `ng-content` projection (slots planned) |
| Class-hook plumbing      | Vue `inheritAttrs: true`          | Explicit `className` input              |
| Stylesheet head          | Imperative `document.head` writes | Same imperative pattern                 |
| Test framework           | `@vue/test-utils`                 | `@angular/core/testing` `TestBed`       |
| SSR engine               | Nuxt 3 / `vue/server-renderer`    | Analog v1 + Nitro / `@angular/ssr`      |

Behaviour stays identical; only the framework idioms differ.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
