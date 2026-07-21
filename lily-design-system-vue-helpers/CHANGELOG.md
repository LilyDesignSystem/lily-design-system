# Changelog — Lily Design System Vue Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- **All four helpers renamed to `*-chooser`, and all four reset to
  0.1.0.**

  | Was | Now |
  | --- | --- |
  | `lily-design-system-vue-theme-select` | `lily-design-system-vue-theme-chooser` |
  | `lily-design-system-vue-locale-select` | `lily-design-system-vue-locale-chooser` |
  | `lily-design-system-vue-text-size-select` | `lily-design-system-vue-text-size-chooser` |
  | `lily-design-system-vue-share-button` | `lily-design-system-vue-share-chooser` |

  `theme-chooser` and `theme-select-option` are two of the 490 components
  in the Lily catalog — a different thing entirely from the helper that
  shared the name. Renaming the helpers removes that collision and gives
  all four a consistent noun.

  The rename is full-depth: directories, file names, package ids,
  exported symbols (`ThemeChooser` → `ThemeChooser`, `nextShareChooserId` →
  `nextShareChooserId`, …), class hooks (`.theme-chooser` →
  `.theme-chooser` and every derivative), and data attributes
  (`data-lily-theme-select` → `data-lily-theme-chooser`, and the locale /
  text-size / share equivalents). `themeName`, `localeName` and
  `sizeName` are unchanged — they never said "select". The emitted
  events (`change`, `share`, `copy`, `nativeShare`) are unchanged too.

  Versions reset to 0.1.0 because a renamed package has no history: none
  of these were ever published, and carrying 0.4.0 forward would imply
  releases that never existed under the new names. Each package's
  `CHANGELOG.md` keeps its prior in-tree history below the new 0.1.0
  entry, under the old names.

- **`share-chooser` loses its trigger naming exception.** The trigger
  was `.share-button-trigger` only because `.share-button-button` read
  badly; under the new name that problem disappears, so it is now
  `.share-chooser-button`, matching the other three helpers.

- The catalog `build.mjs` now **discovers** its publishable sub-packages
  by scanning for directories with a `package.json` and an `index.ts`,
  instead of carrying a hardcoded list that had to be edited by hand on
  every rename or addition.

### Added

- **A fourth helper: `lily-design-system-vue-share-chooser` at 0.1.0.**
  A headless share control — a single-glyph button (↪, U+21AA) that
  opens the **native share sheet** via `navigator.share` where the
  browser provides one, and otherwise a disclosure list of
  consumer-supplied destinations plus a built-in copy-the-URL action.
  Ported from the canonical
  `lily-design-system-svelte-share-chooser` 0.1.0, with the §7 clause
  numbering kept identical across the two suites.

  It is the first helper in this catalog that owns an **action**
  rather than a user preference: it applies nothing to the document
  and persists nothing, so it has no `v-model:value`, no
  `storageKey`, and no hidden input.

  It is also the one helper here that is deliberately **not** an APG
  listbox. Its items are navigation, so they are real `<a>` elements
  with no `role` override — `role="menuitem"` would strip
  middle-click, open-in-new-tab and copy-link-address — and focus
  moves for real rather than via `aria-activedescendant`. The trigger's
  class hook is `share-chooser-button`, following the same
  `{helper}-button` convention as the other three helpers.

  No social-network endpoints ship with the package, and there is no
  default `copyLabel` — both are deliberate, and both are recorded in
  its `spec/index.md` §2–§3.

### Changed (BREAKING)

- **All three helpers** — `theme-chooser`, `locale-chooser`, and
  `text-size-chooser` — are no longer native `<select>`
  elements. Each is now an **icon button that opens a dropdown
  listbox**: a root `<div class="{helper}">` holding a hidden input for
  form participation, a
  `<button class="{helper}-button" aria-haspopup="listbox">` showing a
  single glyph, and a `<ul class="{helper}-list" role="listbox">` of
  `<li class="{helper}-option" role="option">`. The glyphs are ◑
  (U+25D1 CIRCLE WITH RIGHT HALF BLACK) for `theme-chooser`, 🌐
  (U+1F310 GLOBE WITH MERIDIANS) for `locale-chooser`, and `A`
  (U+0041 LATIN CAPITAL LETTER A) for `text-size-chooser`, each wrapped
  in `aria-hidden="true"` so the accessible name always comes from
  `aria-label`.

  `theme-chooser` and `locale-chooser` converted first;
  `text-size-chooser` was deliberately held back and has now joined
  them, so the catalog is one shape again. Its glyph is a plain letter
  rather than a pictograph: U+1F5DB DECREASE FONT SIZE SYMBOL has no
  real glyph in common font stacks and means *decrease* rather than
  *size*.
- **The `placeholder` prop is removed** from `theme-chooser` and
  `locale-chooser`. It existed
  only to pin the closed `<select>` to a short word; there is no
  `<select>` left to pin, so the 0.3.0 placeholder tradeoff is gone
  along with the `{helper}-placeholder` class hook. `text-size-chooser`
  never had the prop.
- **The default scoped slot now replaces the button glyph, not the
  options.** It receives `{ value, open, labelFor }` (`SlotArgs`, also
  exported as `ChildArgs`) instead of the old
  `{ themes/locales/sizes, value, setTheme/setLocale/setSize, name, labelFor, … }`.
  The listbox, its option markup, and the keyboard contract are
  component-owned and cannot be displaced by a slot.
- All three helpers now implement the **WAI-ARIA APG listbox keyboard
  contract** themselves rather than inheriting the platform's native
  `<select>` behaviour: arrow keys that clamp rather than wrap,
  `Home` / `End`, `Enter` / `Space` to commit, `Escape` to cancel,
  `Tab` to close without stealing focus, and printable-character
  typeahead over the labels with a 500 ms buffer. Focus moves to the
  `<ul>` on open and returns to the button on commit or cancel; the
  active option is conveyed with `aria-activedescendant`.

### Added

- `nextThemeChooserId` / `nextLocaleChooserId` / `nextTextSizeChooserId` —
  per-instance id
  generators backed by an incrementing module counter, so option ids
  are stable and SSR-safe.
- `CIRCLE_WITH_RIGHT_HALF_BLACK` / `GLOBE_WITH_MERIDIANS` /
  `LATIN_CAPITAL_LETTER_A` — the default
  button glyphs, exported for consumers building their own triggers.
- `sizeName(slug)` on `text-size-chooser` — exported label resolver that
  title-cases each hyphen-separated word (`"x-large"` → `"X Large"`),
  completing the `themeName` / `localeName` / `sizeName` set. Each
  helper's internal `labelFor` delegates to its resolver, so the
  title-casing rule has exactly one implementation per helper.
- New class hooks: `{helper}-button`, `{helper}-icon`, `{helper}-list`,
  plus `[data-active]` on the keyboard-active option.

### Not added, deliberately

- **No detection prop on `text-size-chooser`.** `theme-chooser` has
  `detectFromSystem` and `locale-chooser` has `detectFromNavigator`, but
  the web exposes no OS "preferred text size" signal — no media query
  equivalent to `prefers-color-scheme`, no `navigator` field. Recorded
  in that helper's `spec/index.md` §2 and §8 so it is not re-proposed
  as an oversight.

### Unchanged

- The managed `<link>` swap, `data-theme`, `lang` / `dir`, RTL
  detection, `localStorage` persistence, navigator detection, the
  `change` and `update:value` events, `v-model:value`, initial-value
  resolution, SSR safety, and every exported pure helper.

### Documentation

- Each helper's `docs/accessibility.md` is rewritten around the three
  new tradeoffs (new file for `text-size-chooser`): an icon-only control
  depends entirely on `aria-label`;
  a scripted listbox has weaker real-world assistive-technology support
  than a native `<select>` — plainly, a native `<select>` remains the
  better choice for some audiences; and the glyph's rendering depends
  on platform fonts. On that last point `text-size-chooser`'s `A` is
  materially safer than a pictograph. The `.{helper}-status`
  live-region guidance is kept
  and is now more strongly recommended, since the closed button shows
  only a glyph.
- `text-size-chooser`'s page keeps its specific WCAG concern, **1.4.4
  (Resize Text)**, with the obligations that come with it: size
  typography in relative units or the attribute does nothing, test at
  the largest size combined with 200% browser zoom, and never disable
  zoom on the strength of shipping the control.
- The listbox needs positioning CSS; the packages ship none. See each
  `docs/styling.md`.

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- `theme-chooser` and `locale-chooser` bumped to **0.3.0**: both are now
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
- `text-size-chooser` is untouched and stays at **0.1.0**.

### Added

- The compensating status region is now the default pattern in the
  examples and quick-starts: a visible `aria-live="polite"` element
  reporting the active value. It exists because placeholder-pinning
  means the control no longer announces its value to a screen reader;
  each package's `docs/accessibility.md` documents that tradeoff
  honestly rather than treating it as solved.

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- `theme-chooser` and `locale-chooser` bumped to **0.2.0**: migrated from
  the radio-group "picker" rendering to a native `<select>` with
  `<option>` children (landed in-tree 2026-06-17), with renamed packages
  (`*-picker` → `*-select`), changed class hooks, and native `<select>`
  keyboard semantics. Behaviour contracts (DOM application, persistence,
  SSR safety, i18n) are unchanged.

### Added

- `text-size-chooser` **0.1.0** — native-`<select>` text-size helper that
  sets `data-text-size` on the document root, with optional
  `localStorage` persistence (added 2026-06-17; born select-based, so it
  carries no picker migration).

## 0.1.0 — 2026-06-05

Initial release. Two helpers ported from the Svelte canonical
catalog:

### Added

- `lily-design-system-vue-theme-select` v0.1.0 — runtime-loading
  theme select with `data-theme` swap, `<link>`-based stylesheet
  injection, `localStorage` persistence, and a scoped slot for custom
  rendering. Fully mirrors the Svelte canonical contract; 13
  acceptance criteria covered.
- `lily-design-system-vue-locale-select` v0.1.0 — BCP 47 locale
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

- `<script setup lang="ts">` everywhere.
- `defineProps<Props>()` + `withDefaults` + `defineEmits<...>()`.
- Two-way binding via `v-model:value`.
- Default scoped slot as the Vue equivalent of Svelte snippets and
  React render-props.
- Zero CSS shipped — consumer styles the kebab-case class hook.
- SSR-safe: all DOM writes inside `onMounted` / `watch`.
- Tests use vitest + jsdom + `@vue/test-utils`.

### Differences from the Svelte canonical

| Concept                 | Svelte canonical                       | Vue port                                |
| ----------------------- | -------------------------------------- | --------------------------------------- |
| Two-way binding         | `bind:value`                           | `v-model:value`                         |
| Reactive state          | `$state`, `$bindable`                  | `ref`, `defineModel`/`v-model`          |
| Reactive side-effects   | `$effect`                              | `watch`, `onMounted`                    |
| Render props / slots    | Snippet (`{#snippet children(...)}`)   | Scoped default slot                     |
| Stylesheet head         | `<svelte:head>`                        | Vue's `<Teleport to="head">` or Nuxt's `useHead` |
| Cookie / SSR            | `hooks.server.ts` + `transformPageChunk` | Nuxt server middleware + `useHead`    |
| Storybook integration   | `*.stories.svelte`                     | `*.stories.ts` (Storybook Vue)          |
| File ext for components | `.svelte`                              | `.vue`                                  |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
