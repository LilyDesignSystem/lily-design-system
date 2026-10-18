---
name: lily-design-system-vue-helpers-skill
description: Use when someone asks how to install or import one of Lily Design System's Vue `*-picker` helper packages (theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, date-time-picker), wants the Vue 3 SFC-specific usage idiom for them (`v-model`, `v-bind="$attrs"`, `defineModel`), needs an individual helper's npm package name (`@lilydesignsystem/vue-theme-picker` and siblings), or wants to know the icon-button-plus-listbox vs. disclosure-of-links vs. field-plus-dialog contract each helper follows.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Vue Helpers — concepts & usage

The Vue helpers are small, opinionated Vue 3 packages, each its own
top-level subproject `lily-design-system-vue-{package}/` since 2026-10-10
(before that, one `lily-design-system-vue-helpers` catalog;
`bin/list-helper-packages vue` lists them), that sit alongside the headless library. Where a headless
component is a pure markup primitive, a helper owns one whole interaction
end to end. Each helper is its own npm package, installed and imported
separately:

```bash
pnpm install @lilydesignsystem/vue-theme-picker
pnpm install @lilydesignsystem/vue-locale-picker
pnpm install @lilydesignsystem/vue-text-size-picker
pnpm install @lilydesignsystem/vue-motion-picker
pnpm install @lilydesignsystem/vue-share-picker
pnpm install @lilydesignsystem/vue-date-time-picker
```

Peer dependency: `vue ^3.0.0`. Each package ships an SFC
(`<script setup lang="ts">`, Composition API only — no Options API, no
`mixins`, no `defineComponent` wrapper), a vitest spec, and its own
`spec/index.md` as its numbered acceptance contract; the canonical
reference for their behaviour is the Svelte helper packages
(`lily-design-system-svelte-{package}/`) — when frameworks disagree, the Svelte
side wins, and the Vue package is a direct port with the framework idiom
swapped, not an independent redesign.

## The first six helpers, one line each

| Helper | Owns | Applies | Persists |
| --- | --- | --- | --- |
| `theme-picker` | a visual theme preference | swaps a managed theme `<link>` + `data-theme` on the document root | optional `localStorage` |
| `locale-picker` | a BCP 47 locale preference | sets `lang` + `dir` on the document root (no translation) | optional `localStorage`; optional `navigator.language` first-visit fallback |
| `text-size-picker` | a text-size preference | sets `data-text-size` on the document root | optional `localStorage` |
| `motion-picker` | a reduced-motion preference | sets `data-motion` on the document root; initial value defers unconditionally to `(prefers-reduced-motion: reduce)` | optional `localStorage` |
| `share-picker` | a share **action** (not a preference) | nothing — opens the native share sheet where available, else a destination list + copy-to-clipboard | none |
| `date-time-picker` | a **form value** (not a preference or an action) | nothing — it holds a value for a form | none |

Full per-helper contracts, root markup, and rules live in
`AGENTS/helpers.md` at the monorepo root — read that rather than expecting
this skill to restate it.

## Shape: three contracts, not one

- **The four preference helpers** (`theme-picker`, `locale-picker`,
  `text-size-picker`, `motion-picker`) share one shape: an icon button
  (`aria-haspopup="listbox"`) opening a `role="listbox"` of
  `role="option"` items, following the WAI-ARIA APG listbox pattern. A
  single glyph is the whole visible surface of the button; the glyph is
  `aria-hidden`, and the accessible name comes from the button's
  `aria-label`.
- **`share-picker`** opens a disclosure of real `<a>` destinations (plus a
  `<button>` for copy-to-clipboard) rather than a listbox — its items are
  navigation, so `role="menuitem"` would strip middle-click and
  open-in-new-tab. It ships no bundled social-network endpoints; the
  consumer supplies `targets`, each with its own `href(url, title, text)`.
- **`date-time-picker`** is the one helper that is a form control: a
  typeable text field paired with an icon-button trigger that opens an APG
  date-picker dialog. It is exempt from the "one glyph, no visible text"
  rule the other five follow, because a form field that can't be typed
  into is hostile to anyone who already knows the date.

## The Vue 3 consumption idiom

- **`v-model` (via `defineModel()`)** carries the current value for every
  helper that has one — the four preferences, and `date-time-picker`'s
  `v-model:value`. `share-picker` has no bound value; it only emits an
  action.
- **`v-bind="$attrs"`** on the root `<div class="{helper} {class}">`
  passes through arbitrary attributes the same way the headless library
  does.
- **Labels are props, not slots.** Every user-facing string — including
  each option's label — is a prop (an override map such as `themeLabels`
  / `localeLabels` / `sizeLabels` / `motionLabels`, or, for
  `date-time-picker`, one `labels` object rather than a dozen flat props).
  The consumer's `children`/slot content (where a helper accepts it)
  replaces the glyph, not the options.
- **SSR-safe.** DOM writes (theme `<link>` swap, `lang`/`dir`,
  `localStorage`) happen only inside `onMounted` / `watch`, never at
  module scope or during render.
- **Applying is idempotent.** Setting an already-applied value is a no-op
  — no DOM write, no `localStorage` write, no re-fired change callback.
  This matters in Vue's reactivity model the same way it matters
  everywhere else in the catalog: a `watch` that re-runs on an unchanged
  value and still fires a consumer callback invites the consumer to write
  state back into the watched value, looping.

Also in the catalog, added after the six above (the contracts are in `spec/helpers/index.md`): `search-picker` (an icon button opening a
disclosure that holds a `<form role="search">`; submitting navigates, GET, to `/?<text>`), `link-picker` (a home icon opening a disclosure of
real `<a>` links the app defines), `menu-picker` and `settings-picker` (a hamburger and a cog icon opening a panel that holds whatever the
app provides), and `picker-bar` (link, search, theme, locale, text-size and share pickers in one row, with the 57 themes and the seven
text sizes pre-wired and one required `labels` object). Every picker has a hoverable, dismissable tooltip.

## The grid-like helpers and label packs

Beyond the pickers, the Vue catalog has `data-grid`, `kanban-board`, `gantt-chart`, `calendar` and `filter` (a filter builder whose
output is JSON, SQL, MongoDB, OData or a predicate) as separate packages (@lilydesignsystem/vue-data-grid and so on;
`bin/list-helper-packages vue` lists them in build order). They follow the Svelte package's contract: where Vue and Svelte disagree,
Svelte wins.

They take a large `labels` object and ship no English, so do not write it by hand per locale. `shared/label-packs/` holds one JSON
pack for each of 46 locales (English plus 45 **unreviewed machine drafts**; have a native speaker check screen-reader wording).
`labelsFor("data-grid", pack)` gives a drop-in `labels` prop. A string a pack lacks leaves the label unset rather than showing another language, and date-dependent labels (weekday names,
period titles) come from `Intl`. Full contract: `spec/label-packs/index.md`.

The Gantt chart can render a critical path (`critical`, `slack`, `labels.criticalLabel`); the optional calculation (`criticalPath()`,
with lag in calendar or working days) ships in the Svelte Gantt package.

## When NOT this skill

- For the headless component catalog itself in Vue (`Button`, `TextInput`,
  `BreadcrumbNav`, and the rest of the 571), use
  `lily-design-system-vue-headless-skill` instead.
- For framework-agnostic Lily concepts — what a helper is as opposed to a
  plain catalog component, the shared contract every catalog's helpers
  follow regardless of framework — use `lily-design-system-skill` instead.
