# Accessibility — `<lily-kanban-board>`

WCAG 2.2 AA target; WAI-ARIA APG Grid pattern for the board, WAI-ARIA
APG Listbox pattern for the per-card move menu.

## WCAG 2.5.7 (Dragging Movements)

Card movement is never drag-only. The keyboard path (Enter/Space opens
a "Move to…" menu) is a fully independent way to reach the same
outcome as a pointer drag — this is the decisive design choice this
component exists to make, backed by the same research cited in
[spec/helpers/index.md](../../../spec/helpers/index.md) and Atlassian's
own Pragmatic Drag and Drop accessibility writeup.

## Roving tabindex vs. `aria-activedescendant`

The grid uses roving `tabindex` (one cell `tabindex="0"` at a time,
real DOM focus moves between cells) rather than
`aria-activedescendant` (virtual focus). This matches `data-grid` and
every other Lily grid-shaped component. The move menu, once open, uses
`aria-activedescendant` internally — a small popup listbox, not a
grid — matching every picker helper's own listbox.

## The move button always renders

The move button's accessible name is gated on `labels.moveButton`
being supplied, but the button itself is never conditionally
rendered — it is the only keyboard-reachable way to move a card, so
removing it when unlabelled would remove the accessible path
entirely, not just its name. Callers should always supply
`labels.moveButton` in practice; an unlabelled icon button is a real,
if narrow, accessibility gap the component cannot fix on the
caller's behalf.

## Known tradeoff: autonomous custom element wrapper

`<lily-kanban-table>` (and, transitively, `<lily-icon-button>`) is an
autonomous custom element, not a customized built-in — see
`dom-utils.ts`'s own doc comment in the headless catalog for why
(WebKit has never implemented customized built-ins). This introduces
one extra DOM node per composed component that a customized built-in
would not need. It does not add an extra node to the accessibility
tree beyond what the real `<table>`/`<button>` it wraps already
provides, since the host element itself carries no ARIA role.

## Stopping propagation inside the open move menu

The move menu's `<ul>` is a descendant of the grid cell that owns the
roving-tabindex keydown handler. Every key the menu itself handles
(arrows, Home/End, Enter/Space, Escape, Tab) calls
`event.stopPropagation()` so it is never ALSO interpreted as a grid
navigation command. This is easy to get wrong silently (both handlers
firing looks correct until you check which cell the roving cursor
ended up on) — see `kanban-board.test.ts` for the regression test that
catches a missing `stopPropagation()` call.
