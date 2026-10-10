# AGENTS — `<search-picker>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless site-search control, packaged as the
`<search-picker>` custom element. A single-icon button (a bundled
magnifying-glass SVG) opens a disclosure panel holding a real
`<form role="search">`: a `type="search"` field and a `⏎` submit button.
Submitting navigates to `${action}?${encodeURIComponent(query.trim())}`
— by default `/?<query>`. Ships no CSS.

Ported from the canonical Svelte helper
[`@lilydesignsystem/svelte-search-picker`](../lily-design-system-svelte-search-picker/).
Svelte wins on behaviour; this package supplies the custom-element idiom.

## Files

| File                     | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| `spec/index.md`          | Specification-driven contract (canonical).        |
| `search-picker.ts`       | Implementation (TypeScript custom-element class). |
| `search-picker.test.ts`  | Vitest + jsdom spec, mapped to the §7 clauses.    |
| `index.ts`               | Barrel re-export + side-effectful registration.   |
| `index.md`               | Human-readable guide.                             |
| `docs/accessibility.md`  | Tradeoffs, stated plainly.                        |

## Public surface

- Class `SearchPicker extends HTMLElement` (registered as
  `<search-picker>` on import of `index.ts`).
- Named exports: `SearchPicker`, `RETURN_SYMBOL` (the bare `⏎`),
  `searchHref`, `nextSearchPickerId`.
- Type exports: `SearchPickerProps`, `SearchPickerSearchDetail`.
- Instance members beyond the attribute mirrors: `value` (live text),
  `open`, `panelId` (getters), `openPanel()`, `closePanel(refocus?)`,
  `navigate` / `onSearch` (property-only functions), and
  `renderButtonContent()` — the overridable rendering hook.

Required attributes: `label`, `input-label`, `submit-label`.

## Deviations from the Svelte API — all forced by the idiom

1. **`children` → `renderButtonContent()`.** Light DOM has no `<slot>`;
   the override reads `this.open` / `this.value` (Svelte's `ChildArgs`).
2. **`navigate` and `onSearch` are property-only** (functions). `onSearch`
   is paired with a bubbling `search` CustomEvent (`detail: { query,
   href }`), matching `<share-picker>`'s `share` / `copy` events.
   Callback first, then the event, then `navigate`.
3. **`value` follows native `<input>` semantics.** The attribute seeds;
   typing updates only the property. Svelte's `bind:value` has no direct
   custom-element equivalent.
4. **No rest-props spread.** The host element *is* the consumer's
   attribute surface; `class` is forwarded onto the rendered root.

## Behaviour contract (one paragraph)

Activating the button toggles the panel; opening focuses the field
with `preventScroll`. Submitting the form (Return in the field, or the
`⏎` button) cancels the native GET — which would send `/?name=value` —
trims the query, and if non-empty fires `onSearch(query, href)`,
dispatches `search`, closes the panel, and calls `navigate(href)`
(default `location.assign`). `Escape` closes and returns focus to the
button; clicking outside (judged by `composedPath()`) or focus moving
to an element outside the root closes. A focusout with no
`relatedTarget` never closes (Safari does not focus a clicked
`<button>`, so `⏎` would otherwise be hidden before its click lands). Nothing is applied to the document and nothing is
persisted.

## Render once, sync in place

`#render()` runs on connect only. Every attribute change afterwards is
an in-place write (`#syncAttributes()`), because no attribute changes
the DOM's shape — so focus in an open panel survives any attribute
change. `attributeChangedCallback` returns early when old === new.

## Conventions this package follows

- Vanilla web component, light DOM only, strict TypeScript.
- No runtime dependencies (mirrors `<share-picker>`).
- No bundled CSS, fonts, or images. The one deliberate exception is the
  default button icon, a bundled SVG matching the other page-header
  pickers.
- All user-facing strings come from attributes. `⏎` is a symbol shown
  to sighted users only; it is never an accessible name.
