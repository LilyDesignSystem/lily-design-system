# AGENTS — SearchPicker (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Svelte 5 headless site-search control. A single-icon button (a bundled
magnifying-glass SVG) opens a disclosure panel holding a real
`<form role="search">`: a `type="search"` field and a `⏎` submit button.
Submitting navigates to `${action}?${encodeURIComponent(query.trim())}`
— by default `/?<query>`. Ships no CSS.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `SearchPicker.svelte` | Implementation. Svelte 5 runes + TypeScript. |
| `SearchPicker.test.ts` | Vitest spec, one test per §7 clause. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |

## Public surface

Default export `SearchPicker`; named `SearchPicker`, `RETURN_SYMBOL`
(the bare `⏎`), `searchHref`, `nextSearchPickerId`; types `Props`,
`ChildArgs`.

Required props: `label`, `inputLabel`, `submitLabel`.

## Behaviour contract (one paragraph)

Activating the button toggles the panel; opening focuses the field.
Submitting the form (Return in the field, or the `⏎` button) cancels the
native GET — which would send `/?name=value` — trims the query, and if
non-empty fires `onSearch(query, href)`, closes the panel, and calls
`navigate(href)` (default `location.assign`). `Escape` closes and returns
focus to the button; clicking outside, or focus moving to an element
outside the root, closes — a focusout with no `relatedTarget` (Safari's
button clicks) never does.
Nothing is applied to the document and nothing is persisted — like
`share-picker`, this owns an action, not a preference.

## HTML

`<div class="search-picker">` → `<button class="search-picker-button">`
with an `aria-hidden` SVG icon → `<div class="search-picker-panel" hidden>`
→ `<form class="search-picker-form" role="search">` →
`<input class="search-picker-input" type="search">` +
`<button type="submit" class="search-picker-submit">` holding
`<span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>`.

## Conventions this package follows

- Svelte 5 runes; strict TypeScript on the public surface.
- The trigger composes `@lilydesignsystem/svelte-headless`'s `IconButton`.
- No bundled CSS, fonts, or images. The one deliberate exception is the
  default button icon, a bundled SVG matching the other page-header
  pickers.
- All user-facing strings come from props. `⏎` is a symbol shown to
  sighted users only; it is never an accessible name.
