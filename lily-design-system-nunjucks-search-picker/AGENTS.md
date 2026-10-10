# AGENTS — SearchPicker (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Nunjucks 3 + vanilla-JS headless site-search control. A single-icon
button (a bundled magnifying-glass SVG) opens a disclosure panel holding
a real `<form role="search">`: a `type="search"` field and a `⏎` submit
button. Submitting navigates to
`${action}?${encodeURIComponent(query.trim())}` — by default `/?<query>`.
Ships no CSS. Ports `@lilydesignsystem/svelte-search-picker`.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time, panel `hidden`.
- The companion ES module picks up the markup in the browser and owns
  open/close, focus, Escape, outside-click/focus-out dismissal, and the
  submit-and-navigate. Focus-out closes only when `relatedTarget` is a
  known element outside the root — never on a null one (Safari's
  click on a `<button>`); see spec §5.2.

## Files

| File                       | Purpose                                                   |
| -------------------------- | --------------------------------------------------------- |
| `spec/index.md`            | Specification-driven contract (canonical).                |
| `search-picker.njk`        | Nunjucks macro (`searchPicker(opts)`).                    |
| `search-picker.client.js`  | ES module — `initSearchPicker`, `autoInit`, helpers.      |
| `search-picker.test.ts`    | Vitest spec, mapped to the §7 clauses.                    |
| `index.md`                 | User guide.                                               |
| `docs/accessibility.md`    | Tradeoffs, stated plainly.                                |
| `docs/ssr.md`              | Server rendering and the no-JS story.                     |

## Public surface

### Macro

- Import: `{% from "./search-picker.njk" import searchPicker %}`
- Call: `{{ searchPicker({label, inputLabel, submitLabel, …}) }}`
- Required `opts` keys: `label`, `inputLabel`, `submitLabel`.

### Client.js

`initSearchPicker`, `autoInit`, `RETURN_SYMBOL` (the bare `⏎`),
`searchHref`, `nextSearchPickerId`. Init opts: `action`, `navigate`,
`onSearch`.

## Where the split reshapes the canonical API

`navigate` / `onSearch` are client-only (a macro cannot hold a
function); `value` is initial-only (no binding); `children` is a
`{% call(args) %}` body receiving a render-time `{open: false, query}`
snapshot; `class` / rest props are `classes` / `attributes`. Full
rationale: [spec/index.md §3.3](./spec/index.md).

## Conventions this package follows

- No bundled CSS, fonts, or images. The one deliberate exception is the
  default button icon, a bundled SVG matching the other page-header
  pickers.
- All user-facing strings come from parameters. `⏎` is a symbol shown
  to sighted users only; it is never an accessible name, and it is a
  bare literal character in source (`bin/test` glyph rule).
- Applies nothing to the document, persists nothing — like
  `share-picker`, this owns an action, not a preference.

## Tooltip

`.search-picker-tooltip` (`<div role="tooltip" id="{id}-tooltip" hidden>`) is rendered right after the icon button, holding the button's `label`. `search-picker.client.js` shows it on pointer hover (button or tooltip) or keyboard focus (`:focus-visible`), hides it on `Escape` (focus stays) and never shows it while the popup is open. Not linked with `aria-describedby`. See `spec/index.md` (Tooltip).
