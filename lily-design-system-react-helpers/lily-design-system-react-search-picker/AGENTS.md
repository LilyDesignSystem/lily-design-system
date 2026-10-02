# AGENTS — SearchPicker (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A React 19 headless site-search control. A single-icon button (a bundled
magnifying-glass SVG) opens a disclosure panel holding a real
`<form role="search">`: a `type="search"` field and a `⏎` submit button.
Submitting navigates to `${action}?${encodeURIComponent(query.trim())}`
— by default `/?<query>`. Ships no CSS.

Ported from the canonical Svelte helper
(`../../lily-design-system-svelte-helpers/lily-design-system-svelte-search-picker/`),
whose spec numbering this package mirrors clause for clause.

## Files

| File                     | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `spec/index.md`          | Specification-driven contract (canonical).   |
| `SearchPicker.tsx`       | Implementation. React 19 hooks + TypeScript. |
| `SearchPicker.test.tsx`  | Vitest spec, mapped to the §7 clauses.       |
| `index.ts`               | Barrel re-export.                            |
| `index.md`               | User guide.                                  |
| `docs/accessibility.md`  | Tradeoffs, stated plainly.                   |
| `examples/`              | Runnable React 19 examples.                  |

## Public surface

Default export `SearchPicker`; named `SearchPicker`, `RETURN_SYMBOL`
(the bare `⏎`), `searchHref`, `nextSearchPickerId`; types `Props`,
`ChildArgs`.

Required props: `label`, `inputLabel`, `submitLabel`. Optional
`children` is a render prop that replaces the **icon** inside the button
and receives `{ open, query }`.

## Behaviour contract (one paragraph)

Activating the button toggles the panel; opening focuses the field.
Submitting the form (Return in the field, or the `⏎` button) cancels the
native GET — which would send `/?name=value` — trims the query, and if
non-empty fires `onSearch(query, href)`, closes the panel, and calls
`navigate(href)` (default `location.assign`). `Escape` closes and returns
focus to the button; clicking outside or focus leaving the root closes.
Nothing is applied to the document and nothing is persisted — like
`share-picker`, this owns an action, not a preference.

## HTML

`<div class="search-picker">` → `<button class="search-picker-button">`
with an `aria-hidden` SVG icon → `<div class="search-picker-panel" hidden>`
→ `<form class="search-picker-form" role="search">` →
`<input class="search-picker-input" type="search">` +
`<button type="submit" class="search-picker-submit">` holding
`<span class="search-picker-submit-symbol" aria-hidden="true">⏎</span>`.

## React specifics an agent will trip over

- Svelte's bindable `value` becomes the catalog's controlled/uncontrolled
  idiom: `value` + `onChange` (controlled) or `defaultValue`
  (uncontrolled). `Props` omits `children`, `onChange`, and
  `defaultValue` from `React.HTMLAttributes<HTMLDivElement>` because all
  three are redefined.
- The panel id comes from `React.useId()`, so it survives hydration.
  `nextSearchPickerId()` is exported for parity with Svelte but is
  **not** what the component uses.
- Focus moves in a `useEffect` keyed on `open`, not in the handler: the
  field is `hidden` until the open is committed. `focusInputRef` carries
  whether an open should focus the field; `refocusRef` whether a close
  should return focus to the trigger.
- Focus-out uses React's `onBlur` on the root, the delegated equivalent
  of native `focusout`.

## Conventions this package follows

- React 19 function components with hooks; strict TypeScript on the
  public surface.
- The trigger composes `@lilydesignsystem/react-headless`'s `IconButton`.
- No bundled CSS, fonts, or images. The one deliberate exception is the
  default button icon, a bundled SVG matching the other page-header
  pickers.
- All user-facing strings come from props. `⏎` is a symbol shown to
  sighted users only; it is never an accessible name.
