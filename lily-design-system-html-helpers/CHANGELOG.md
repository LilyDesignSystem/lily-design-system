# Changelog — Lily Design System HTML Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

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
catalog to vanilla web-component (custom-element) idioms:

### Added

- `lily-design-system-html-theme-select` v0.1.0 — `<theme-select>`
  runtime-loading theme select. Imperatively swaps a managed
  `<link rel="stylesheet" data-lily-theme-select="{name}">` in
  `<head>`, writes `data-theme` to `<html>`, optionally persists to
  `localStorage`, dispatches a `themechange` `CustomEvent`. 13
  acceptance criteria covered.
- `lily-design-system-html-locale-select` v0.1.0 — `<locale-select>`
  BCP 47 locale select that writes `lang` and `dir` on the document
  root, with optional `localStorage` persistence and
  `navigator.languages` detection. Built-in 436-row locale-name
  table and RTL detection. Dispatches a `localechange`
  `CustomEvent`. 23 acceptance criteria covered.
- Parent-level `AGENTS/` with `conventions.md`, `testing.md`,
  `accessibility.md`, `ssr.md`.
- Parent-level `AGENTS/shared/` with `headless-principles.md`,
  `i18n-principles.md`, `theme-principles.md` adapted from the
  Lily-wide root `AGENTS/`.
- Each helper subproject ships `AGENTS/`, `docs/`, and `examples/`
  subdirectories mirroring the Svelte canonical depth.

### Conventions established

- `class extends HTMLElement` for every helper.
- `static get observedAttributes()` enumerates the watched kebab-case
  attributes.
- Side-effectful registration via `customElements.define(...)` in
  `index.ts`, guarded by `customElements.get(tag)` for idempotence.
- Kebab-case attributes mirror camelCase JS properties.
- Array properties accept native `string[]`; CSV-encoded in the
  attribute.
- Object properties accept native `Record<string, string>`;
  JSON-encoded in the attribute.
- `CustomEvent` (`bubbles: true, composed: true`) for change
  notifications.
- Light DOM only — no Shadow DOM, no scoped styling.
- Zero CSS shipped — consumer styles the kebab-case class hook.
- SSR-safe: no top-level DOM access, `customElements.define`
  guarded.
- Tests use vitest + jsdom.

### Differences from the Svelte canonical

| Concept              | Svelte canonical                       | HTML port (custom element)                                  |
| -------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Two-way binding      | `bind:value`                           | Read/write `el.value` / `el.setAttribute("value", …)`       |
| Reactive state       | `$state`, `$bindable`                  | Internal `#private` fields + `attributeChangedCallback`     |
| Reactive side-effects | `$effect`                              | `connectedCallback` + `attributeChangedCallback`            |
| Render props / slots | Snippet (`{#snippet children(...)}`)   | Subclass the class, override `#render()`                    |
| Stylesheet head      | `<svelte:head>`                        | Imperative `document.head.appendChild(...)`                 |
| Change notification  | `onchange` prop callback               | `CustomEvent("themechange" / "localechange")`               |
| SSR                  | `hooks.server.ts` + `transformPageChunk` | Static-site generator renders attributes; client upgrades   |
| Storybook            | `*.stories.svelte`                     | Static `.html` files in `examples/`                         |
| File ext             | `.svelte`                              | `.ts` (class) + `.html` (examples)                          |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause.

### Spelling note

The HTML catalog uses `normalizeThemesUrl` (American `z`) to match
DOM-API convention (`document.normalize`, `Intl.NumberFormat`,
`String.normalize`). The Svelte canonical uses `normaliseThemesUrl`
(British `s`). Both libraries document the divergence.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
