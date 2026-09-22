# AGENTS — `<lily-kanban-board>` (Web Components helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless interactive kanban board, packaged
as the `<lily-kanban-board>` custom element. Composes
`@lilydesignsystem/web-components-headless`'s `<lily-kanban-table>` (a
real npm dependency, unmodified) and `<lily-icon-button>` for the
per-card move-menu trigger. Ships no CSS.

Direct port of `@lilydesignsystem/svelte-kanban-board`, following the
React/Vue/Angular/Blazor ports. Implemented 2026-09-22.

## Files

| File | Purpose |
| --- | --- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `kanban-board.ts` | Implementation (TypeScript custom-element class). |
| `kanban-board.test.ts` | Vitest + jsdom spec, one or more assertions per §8 acceptance clause, plus two extra regression tests (see below). |
| `index.ts` | Barrel re-export + side-effectful registration. |
| `index.md` | Human-readable guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | A runnable HTML page. |

## Public surface

- Class `KanbanBoard extends HTMLElement` (registered as
  `<lily-kanban-board>` on import of `index.ts`).
- Named export: `nextKanbanBoardId`.
- Type exports: `KanbanBoardProps`, `KanbanColumn`, `KanbanCard`,
  `KanbanLabels`.

Required attribute: `label`. Required properties: `columns`, `cards`
(property-only — arrays of objects have no attribute-string encoding,
same convention as `picker-bar`'s `shareTargets`).

## Behaviour contract (one paragraph)

Cards render in a rectangular grid: rows correspond to a card's
position within its column, columns to `KanbanColumn`. Shorter columns
pad with empty, non-tabbable cells so every column has the same row
count as the tallest one. Keyboard follows the WAI-ARIA APG Grid
roving-tabindex model — one cell `tabindex="0"` at a time. Moving a
card is never arrow-key-drag-only (WCAG 2.5.7): Enter/Space on a
focused card opens a "Move to…" listbox (hand-rolled markup, not a
composed `<lily-listbox>` — see spec/index.md §3) listing destination
columns. Pointer drag-and-drop (native HTML5) is supplementary. A
column's `wipLimit`, once exceeded, marks the column
`data-over-limit` — a styling hook, not an enforced block. Every
successful move announces through one `.kanban-board-status
aria-live="polite"` region built from a caller-supplied
`labels.moveAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="kanban-board {class}">` wrapping the
unmodified `<lily-kanban-table>` (with `role="grid"` explicitly set —
see spec/index.md §3 for why that override is necessary) and each
card's move-menu `<ul>`, always present and toggled via `hidden` (a
deliberate deviation from the Svelte reference's mount/unmount — see
spec/index.md §4).

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, explicitly set on
  `<lily-kanban-table>`).
- Roving tabindex, not `aria-activedescendant`, for the board itself.
  The move menu uses `aria-activedescendant` internally.
- The move menu is the accessible path for card movement; drag is
  supplementary, never required.
- One `aria-live="polite"` region for all move announcements.
- Every handled key inside the open move menu calls
  `event.stopPropagation()` so it never also drives the grid's own
  roving-tabindex handler (both listen on overlapping DOM — the
  listbox is nested inside the currently-focused grid cell). Verified
  by a dedicated test, not merely implemented — see spec/index.md §6.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`, light
  DOM only, no Shadow DOM).
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/web-components-headless` as a real
  dependency — never vendors `<lily-kanban-table>`'s or
  `<lily-icon-button>`'s markup.
- Builds every table-related element with `document.createElement`/
  `appendChild` — never `innerHTML` or a template-literal HTML string
  (the HTML5 parser silently drops a bare `<thead>`/`<tr>`/`<td>` start
  tag outside a real `<table>`'s own insertion mode).
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` property; a label's
  presence gates the control it names — no baked-in English fallback.
  Exception: the move button itself always renders (keyboard access
  depends on it existing); only its accessible *name* is gated.
- Non-goals (multi-select/bulk move, swimlanes, card detail editing,
  virtualization, column reorder, card sub-tasks) are documented, not
  silently missing — see spec/index.md §9.

## The move-button shared-ref risk — already resolved here

Every other framework catalog's port of this component independently
found the same latent bug in the Svelte reference (a single shared
button ref, refocusing the *last-mounted* card instead of the card
whose menu closed). This implementation has no framework ref-binding
sugar at all — each card's `<lily-icon-button>` host lives in a
`Map<cardId, HTMLElement>`, so there is no shared variable for the bug
to live in in the first place. Still verified explicitly by a
dedicated regression test (not merely assumed safe because of the
different architecture) — see spec/index.md §10.
