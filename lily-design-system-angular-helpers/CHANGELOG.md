# Changelog — Lily Design System Angular Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release
time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

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
