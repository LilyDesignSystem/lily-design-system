# AGENTS — SearchPicker (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Vue 3 headless site-search control. A single-icon button (a bundled
magnifying-glass SVG) opens a disclosure panel holding a real
`<form role="search">`: a `type="search"` field and a `⏎` submit button.
Submitting navigates to `${action}?${encodeURIComponent(query.trim())}`
— by default `/?<query>`. Ships no CSS.

A direct port of the canonical
[`@lilydesignsystem/svelte-search-picker`](../lily-design-system-svelte-search-picker/).
When the two disagree, the Svelte side wins.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `SearchPicker.vue` | Implementation. `<script setup lang="ts">`. |
| `SearchPicker.test.ts` | Vitest spec, one test per §7 clause. |
| `index.ts` | Barrel re-export. |
| `shims.d.ts` | Local ambient declaration for `@lilydesignsystem/vue-headless` (build-time typing only). |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |

## Public surface

Default export `SearchPicker`; named `SearchPicker`, `RETURN_SYMBOL`
(the bare `⏎`), `searchHref`, `nextSearchPickerId`; types `Props`,
`SlotArgs`, `ChildArgs` (alias of `SlotArgs`).

Required props: `label`, `inputLabel`, `submitLabel`.

## Behaviour contract (one paragraph)

Activating the button toggles the panel; opening focuses the field.
Submitting the form (Return in the field, or the `⏎` button) cancels the
native GET — which would send `/?name=value` — trims the query, and if
non-empty emits `search(query, href)`, closes the panel, and calls
`navigate(href)` (default `location.assign`). `Escape` closes and returns
focus to the button; clicking outside or focus leaving the root closes.
Nothing is applied to the document and nothing is persisted — like
`share-picker`, this owns an action, not a preference.

## Events, not callback props

The Svelte canonical's `onSearch` callback prop maps to the `search`
emitted event, the same way share-picker's `onShare` maps to `@share`.
`navigate` stays a prop: it is the action itself, with a default.
`value` is `v-model:value` (`update:value`), matching the sibling
pickers.

## HTML

`<div class="search-picker">` → `<button class="search-picker-button">`
with an `aria-hidden` SVG icon → `<div class="search-picker-panel" hidden>`
→ `<form class="search-picker-form" role="search">` →
`<input class="search-picker-input" type="search">` +
`<button type="submit" class="search-picker-submit">` holding
`<span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>`.

## Vue gotchas this package already handles

- `await nextTick()` before `.focus()` in `openPanel` / `closePanel`: a
  `hidden` element cannot take focus until the DOM has flushed. jsdom
  does not enforce this, so no test guards it — do not "simplify" it
  away.
- The trigger composes `@lilydesignsystem/vue-headless`'s `IconButton`;
  a template ref on it resolves to its exposed `{ el }`, not the DOM node.

## Conventions this package follows

- Vue 3 `<script setup lang="ts">`; `defineProps` + `withDefaults`,
  `defineEmits`.
- No bundled CSS, fonts, or images. The one deliberate exception is the
  default button icon, a bundled SVG matching the other page-header
  pickers, overridable via the default scoped slot.
- All user-facing strings come from props. `⏎` is a symbol shown to
  sighted users only; it is never an accessible name.

## Tooltip

`<div class="search-picker-tooltip" role="tooltip" id="{baseId}-tooltip" hidden>{label}</div>` — a sibling right after the icon button; text is the button's `label`; shown on pointer hover (button or tooltip) or `:focus-visible` on the button, dismissed by `Escape` on the button, never shown while the panel is open; deliberately not `aria-describedby`-linked. Class hook: `.search-picker-tooltip`.
