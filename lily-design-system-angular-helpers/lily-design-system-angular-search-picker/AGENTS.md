# AGENTS — SearchPicker (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

An Angular 20 headless site-search control. A single-icon button (a
bundled magnifying-glass SVG) opens a disclosure panel holding a real
`<form role="search">`: a `type="search"` field and a `⏎` submit button.
Submitting navigates to `${action}?${encodeURIComponent(query.trim())}`
— by default `/?<query>`. Ships no CSS. Angular port of the Svelte
canonical `@lilydesignsystem/svelte-search-picker`.

## Files

| File                              | Purpose                                           |
| --------------------------------- | ------------------------------------------------- |
| `spec/index.md`                   | Specification-driven contract (canonical).        |
| `search-picker.component.ts`      | Implementation. Standalone, signal-based, OnPush. |
| `search-picker.component.spec.ts` | Vitest spec, one test per §7 clause (24 cases).   |
| `docs/accessibility.md`           | Tradeoffs, stated plainly.                        |
| `examples/`                       | Runnable standalone example components.           |
| `index.ts`                        | Barrel re-export.                                 |
| `index.md`                        | User guide.                                       |

## Public surface

- `SearchPicker` (component class, selector `lily-search-picker`).
- `SearchPickerIcon` (optional marker directive,
  `ng-template[lilySearchPickerIcon]`, for typed `let-` variables).
- `RETURN_SYMBOL` (the bare `⏎`), `searchHref`, `nextSearchPickerId`.
- Types `ChildArgs`, `SearchEvent`.

Required inputs: `label`, `inputLabel`, `submitLabel`. Output:
`searched` (not `search` — see spec §3).

## Behaviour contract (one paragraph)

Activating the button toggles the panel; opening focuses the field.
Submitting the form (Return in the field, or the `⏎` button) cancels the
native GET — which would send `/?name=value` — trims the query, and if
non-empty emits `searched({ query, href })`, closes the panel, and calls
`navigate(href)` (default `location.assign`). `Escape` closes and returns
focus to the button; clicking outside or focus moving to an element outside the root closes (a focusout with no `relatedTarget` never closes — Safari, spec §5.2).
Nothing is applied to the document and nothing is persisted — like
`share-picker`, this owns an action, not a preference.

## HTML

`<div class="search-picker">` → `<button class="search-picker-button">`
(via headless `IconButton`) with an `aria-hidden` SVG icon →
`<div class="search-picker-tooltip" role="tooltip" hidden>` (the `label`) →
`<div class="search-picker-panel" hidden>` →
`<form class="search-picker-form" role="search">` →
`<input class="search-picker-input" type="search">` +
`<button type="submit" class="search-picker-submit">` holding
`<span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>`.

## Conventions this package follows

- Standalone component, signal inputs, `model()` for `value`, `output()`
  for `searched`, `OnPush`, `@if` control flow, no NgModules.
- The trigger composes `@lilydesignsystem/angular-headless`'s `IconButton`.
- No bundled CSS, fonts, or images. The one deliberate exception is the
  default button icon, a bundled SVG matching the other page-header
  pickers.
- All user-facing strings come from inputs. `⏎` is a symbol shown to
  sighted users only; it is never an accessible name.
