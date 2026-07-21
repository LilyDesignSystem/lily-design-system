# Changelog — Lily Design System Svelte Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- **All four helpers renamed to `*-chooser`**, each reset to `0.1.0`:

  | Was | Now |
  | --- | --- |
  | `lily-design-system-svelte-theme-select` | `lily-design-system-svelte-theme-chooser` |
  | `lily-design-system-svelte-locale-select` | `lily-design-system-svelte-locale-chooser` |
  | `lily-design-system-svelte-text-size-select` | `lily-design-system-svelte-text-size-chooser` |
  | `lily-design-system-svelte-share-button` | `lily-design-system-svelte-share-chooser` |

  A full-depth rename: directories, component and test file names,
  package names, exported symbols (`ThemeChooser`, `nextThemeChooserId`,
  …), CSS class hooks and their derivatives, and the
  `data-lily-{helper}-chooser` attributes.

  Two motivations. First, `theme-chooser` collided with the catalog
  component of the same name in `components.tsv`, which shares the hook
  `.theme-chooser`; the helpers no longer contend for it. Second, none of
  these controls is a native `<select>` any more — all four are icon
  buttons opening WAI-ARIA APG listboxes — so "select" had stopped
  describing them.

  Versions reset to `0.1.0` because nothing has been published under the
  new names; carrying the old numbers forward would imply releases that
  never existed.

- **`share-chooser` loses its class-hook exception.** The trigger was
  `share-button-trigger` because `.share-button-button` read badly. Under
  the new name it is **`share-chooser-button`**, matching the other three
  helpers. The documented exception is removed from its spec, `AGENTS.md`
  and changelog.

### Added

- **`lily-design-system-svelte-share-chooser` 0.1.0** — a new helper, and
  the first that owns an *action* rather than a user preference: it
  applies nothing to the document and persists nothing. A single-glyph
  button (↪, U+21AA) opens the native share sheet where the browser has
  one, and otherwise a disclosure list of consumer-supplied destinations
  plus copy-to-clipboard. No social-network endpoints ship with it.
  Destinations are real `<a>` elements rather than `role="menuitem"`, so
  middle-click and open-in-new-tab survive.

### Changed (BREAKING)

- **`text-size-chooser` is now an icon button + APG listbox**, matching
  `theme-chooser` and `locale-chooser`. It was the last native `<select>`
  among the helpers. Button glyph is `"A"` (U+0041): the obvious
  candidate U+1F5DB has no real glyph in common font stacks and falls
  back to a crude bitmap shape, and means *decrease* rather than *size*.
- `sizeName` is exported to mirror `themeName` / `localeName`, and
  `labelFor` delegates to it. No detection prop was added — there is no
  OS "preferred text size" equivalent to `prefers-color-scheme`.

### Fixed

- `CSS.escape` in all three `*-select` helpers threw inside the keydown
  handler under jsdom, which has no `CSS` object at all. The throw landed
  *after* `activeIndex` was assigned, so the suites stayed green while
  that path never ran. Replaced with `document.getElementById`, which
  needs no escaping for these generated ids.

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

Initial release. This is the **canonical reference catalog** for
Lily's framework-helper layer. The parallel Vue, React, Angular,
Blazor, Nunjucks, and HTML catalogs port from here; when contracts
disagree, the Svelte side wins and the others are patched.

### Added

- `lily-design-system-svelte-theme-chooser` v0.1.0 — runtime-loading
  theme select with `data-theme` swap, managed `<link>`-based
  stylesheet injection, `localStorage` persistence, and a `children`
  snippet for custom rendering. 13 acceptance criteria covered.
- `lily-design-system-svelte-locale-chooser` v0.1.0 — BCP 47 locale
  select that writes `lang` and `dir` on the document root, with
  optional `localStorage` persistence and `navigator.languages`
  detection. Built-in 436-row locale-name table, RTL detection set,
  and lossless underscore-vs-hyphen round-tripping. 23 acceptance
  criteria covered.
- Parent-level `AGENTS/` with `conventions.md`, `testing.md`,
  `accessibility.md`, `ssr.md`.
- Parent-level `AGENTS/shared/` with `headless-principles.md`,
  `i18n-principles.md`, `theme-principles.md` adapted from the
  Lily-wide root `AGENTS/`.
- Each helper subproject ships `AGENTS/`, `docs/`, and `examples/`
  subdirectories. Theme select ships a runnable SvelteKit cookie
  example under `examples/sveltekit-cookie/`.

### Conventions established

- **Svelte 5 runes only.** `$props()`, `$bindable()`, `$state()`,
  `$effect()`. No Svelte 4 syntax anywhere.
- **TypeScript** on the public surface — `Props` and `ChildArgs`
  exported from a `<script lang="ts" module>` block.
- **Two-way binding** via `bind:value` on a `$bindable("")` prop.
- **Custom rendering** via a `children?: Snippet<[ChildArgs]>` prop
  rendered with `{@render children(args)}`.
- **Rest-prop spread** on the root element so consumers can pass
  `id`, `data-*`, `aria-*`, and event handlers without the component
  blocking them.
- **No `<style>` blocks** — zero CSS shipped from the helper layer.
- **SSR-safe** — all DOM writes inside `$effect`, never at the top
  level of the instance `<script>`.
- **Tests** under vitest + jsdom + `@testing-library/svelte`. One
  `it(...)` per numbered `spec/index.md` §7 acceptance criterion.

### Why Svelte is canonical

The selects were written first in Svelte 5 because the runes-based
reactivity model maps cleanly to every other framework's pattern:

- `$bindable` ↔ Vue `v-model:value` ↔ React `value`+`onChange` ↔
  Angular `[(value)]`.
- `Snippet<[Args]>` ↔ Vue scoped slot ↔ React render prop ↔ Angular
  `*ngTemplateOutlet`.
- `$effect` ↔ Vue `onMounted`+`watch` ↔ React `useEffect` ↔ Angular
  `effect()`.
- `$props()` ↔ Vue `defineProps` ↔ React function parameter ↔
  Angular `@Input`.

Locking the contract in Svelte first kept the port translations
mechanical.

### Differences carried into the ports

| Concept                 | Svelte canonical                       | Vue / React / Angular port                                  |
| ----------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Two-way binding         | `bind:value`                           | `v-model:value` / `value`+`onChange` / `[(value)]`          |
| Reactive state          | `$state`, `$bindable`                  | `ref` / `useState` / signal                                 |
| Reactive side-effects   | `$effect`                              | `watch`+`onMounted` / `useEffect` / `effect()`              |
| Render props / slots    | Snippet (`{#snippet children(...)}`)   | Scoped slot / render prop / `*ngTemplateOutlet`             |
| Stylesheet head         | `<svelte:head>` or imperative          | `<Teleport to="head">` / portal / `Head` component          |
| Cookie / SSR            | `hooks.server.ts` + `transformPageChunk` | Nuxt server middleware / Next.js middleware / Analog hooks |
| Storybook integration   | `*.stories.svelte`                     | `*.stories.ts`                                              |
| File ext for components | `.svelte`                              | `.vue` / `.tsx` / `.component.ts`                           |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause across all seven framework catalogs.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
