# AGENTS — Lily Web Components Helpers

> **Provenance.** This catalog is a maintainer-directed (2026-09-03) independent copy of
> [`lily-design-system-html-helpers`](../lily-design-system-html-helpers/), which is itself
> already six vanilla custom elements. It differs in tag prefix — `<lily-theme-picker>`
> rather than `<theme-picker>`, matching the Web Components headless catalog — and in
> package naming. Nothing ports between the two automatically: a change to one must be
> applied to the other deliberately. The Svelte catalog remains canonical for contracts.

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper, packaged as a
vanilla HTML/JS **web component** (custom element). Find the
helper's `spec/index.md` for the canonical contract before changing it.
Each helper follows the file shape in
[index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`@lilydesignsystem/web-components-theme-picker`](./lily-design-system-web-components-theme-picker/) — `<lily-theme-picker>` dynamic theme CSS loader.
- [`@lilydesignsystem/web-components-locale-picker`](./lily-design-system-web-components-locale-picker/) — `<lily-locale-picker>` `lang` + `dir` locale picker.
- [`@lilydesignsystem/web-components-text-size-picker`](./lily-design-system-web-components-text-size-picker/) — `<lily-text-size-picker>` `data-text-size` text-size picker.
- [`@lilydesignsystem/web-components-motion-picker`](./lily-design-system-web-components-motion-picker/) — `<lily-motion-picker>` `data-motion` reduced-motion picker; defaults to the OS's own `(prefers-reduced-motion: reduce)` signal rather than a fixed slug.
- [`@lilydesignsystem/web-components-share-picker`](./lily-design-system-web-components-share-picker/) — `<lily-share-picker>` native-sheet / disclosure share control.
- [`@lilydesignsystem/web-components-date-time-picker`](./lily-design-system-web-components-date-time-picker/) — `<lily-date-time-picker>` WAI-ARIA APG date/time picker dialog.
- [`@lilydesignsystem/web-components-picker-bar`](./lily-design-system-web-components-picker-bar/) — `<lily-picker-bar>` composes theme/locale/text-size/share pickers into one page-header row. Owns no preference/action/form-value of its own; depends on the four wrapped pickers as real npm packages and pre-wires the 45-theme reference list and the seven-step text-size scale.
- [`@lilydesignsystem/web-components-kanban-board`](./lily-design-system-web-components-kanban-board/) — `<lily-kanban-board>` composes the headless `<lily-kanban-table>` (with `role="grid"` set explicitly — it defaults to `role="region"`) plus `<lily-icon-button>` for a per-card "Move to…" menu. WAI-ARIA APG Grid roving-tabindex; card movement is never drag-only (WCAG 2.5.7). Ports `@lilydesignsystem/svelte-kanban-board`.
- [`@lilydesignsystem/web-components-gantt-chart`](./lily-design-system-web-components-gantt-chart/) — `<lily-gantt-chart>` composes the headless `<lily-gantt-table>` plus the sibling `<lily-date-time-picker>` (used twice per edit session). Row hierarchy, milestones, percent-complete, today marker, finish-to-start dependencies via `aria-describedby`. Ports `@lilydesignsystem/svelte-gantt-chart`.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- The custom-element class is defined on import (side-effectful
  registration via `customElements.define(...)`). The class itself
  remains exported so consumers who want to control registration
  themselves can import it without the auto-define — see each
  helper's spec/index.md §3 (Architectural decisions) for the exact
  rule.
- Tests use vitest + jsdom.
- No hardcoded user-facing strings; everything comes from
  attributes or properties.
- Light DOM only — no Shadow DOM, no scoped styling. The
  consumer's CSS targets the rendered children directly via the
  kebab-case class hooks the element emits (`theme-picker-option`,
  `locale-picker-option`, etc.).
- One rendering shape for the preference helpers. All four render an
  icon button that opens a `role="listbox"` dropdown (WAI-ARIA APG
  listbox pattern, keyboard implemented in JS). Do not reintroduce the
  native `<select>` — or its `placeholder` attribute — to any of them.
  `<lily-text-size-picker>` was the last holdout and joined the other two;
  its icon is a bundled stroke-drawn "A" SVG rather than a pictograph.
  `<lily-motion-picker>` joined afterward as the fourth, following the same
  shape; its icon is a bundled pause-sign SVG and its initial
  value defers to `(prefers-reduced-motion: reduce)` rather than a
  fixed default. As of 2026-09-16 every preference helper's default
  icon is a bundled SVG, not a Unicode character — see each helper's
  own `docs/accessibility.md` for the reversal record.
- `<lily-share-picker>` is the deliberate exception to that rule: it is a
  **disclosure** whose items are real `<a>` elements with no `role`
  override, and focus moves to the item rather than staying on the
  `<ul>` with `aria-activedescendant`. Share destinations are
  navigation, so a listbox or `role="menuitem"` would strip
  middle-click, open-in-new-tab and copy-link-address. Do not
  "harmonise" it into a listbox. It is also the first helper that owns
  an **action** rather than a user preference: it applies nothing to the
  document and persists nothing.
- `<lily-date-time-picker>` is a second, different kind of exception: it is a
  **form control**, not a page-header preference widget, so its trigger
  opens a `role="dialog"` month grid (WAI-ARIA APG Date Picker Dialog),
  not a listbox. Like `<lily-share-picker>` it persists nothing. Its `labels`
  and `shortcuts` are property-only rather than JSON-encoded attributes
  — see its `spec/index.md` §4.3 for why the object-attribute convention
  below does not fit here.
- Attributes are kebab-case; observed attributes trigger
  `attributeChangedCallback`. Array attributes are
  comma-separated strings; the matching JS property accepts an
  `Array<string>` for ergonomic programmatic use. Object
  attributes are JSON-encoded; the JS property accepts a native
  `Record<string, string>`.
- Change notifications fire as `CustomEvent`s with `bubbles: true`
  and `composed: true`.
- **Composing one helper's element inside another (as `<lily-picker-bar>`
  does)**: depend on the sibling as a real npm `dependency`, and (1)
  register it via a bare `import "package-name";` side-effect import —
  never only `import { TheClass } from "package-name"` used solely in
  a type position (`as TheClass`), which esbuild's TS transform elides
  along with its registration side effect; import the class via
  `import type` instead for casts — and (2) connect the parent chain
  to the document BEFORE appending the child custom element into it,
  not after — jsdom does not reliably fire `connectedCallback`
  recursively for a subtree that is built fully detached and then
  attached in one move. See `lily-design-system-web-components-picker-bar/AGENTS.md`
  for the concrete example both bit.

## Topic agent files

- [`AGENTS/conventions.md`](./AGENTS/conventions.md) — custom-element
  shape, attribute/property mirroring, CustomEvent contract, light
  DOM, naming.
- [`AGENTS/testing.md`](./AGENTS/testing.md) — vitest + jsdom harness,
  attribute timing, CustomEvent capture, mocking.
- [`AGENTS/accessibility.md`](./AGENTS/accessibility.md) — WCAG 2.2 AAA,
  the APG listbox pattern all three helpers implement, the tradeoffs
  against the native `<select>` they replaced, light-DOM rationale.
- [`AGENTS/ssr.md`](./AGENTS/ssr.md) — Eleventy / Astro / Hugo
  prerender + client upgrade.
- [`AGENTS/shared/`](./AGENTS/shared/) — Lily-wide headless / i18n /
  theme principles adapted for this catalog.
