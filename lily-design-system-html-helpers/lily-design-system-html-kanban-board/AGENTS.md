# AGENTS — `<kanban-board>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A reusable, headless vanilla HTML/JS interactive kanban board, packaged
as a custom element (`<kanban-board>`, no `lily-` prefix — unlike the
Web Components catalog). Cards move between columns by pointer
drag-and-drop or, independently, by a keyboard-accessible per-card
"Move to…" menu built from `@lilydesignsystem/html-headless`'s
`ListboxController` — never drag-only. WAI-ARIA APG Grid roving-tabindex
keyboard navigation across a rectangular grid (columns × the largest
column's card count). Ships no CSS.

Ported from the canonical
[`@lilydesignsystem/svelte-kanban-board`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/)
(2026-09-21), implemented here 2026-09-22.

**Unlike every other catalog that has ported this helper so far**
(React, Vue, Angular, Blazor, Web Components — all of which have a real
`KanbanTable` component family in their headless layer), this catalog's
`lily-design-system-html-headless` `kanban-table*.html` files are pure
markup-contract documentation, not JS classes. There is nothing to
import for the table structure — `kanban-board.ts` builds the documented
class names (`kanban-table`, `kanban-table-head`/`-body`/`-row`/`-th`/
`-td`) by hand, exclusively via `document.createElement`/`appendChild`
(never `innerHTML` — see spec §3 for the parser-safety reason).

## Files

| File                    | Purpose                                                |
| ------------------------ | ------------------------------------------------------- |
| `spec/index.md`          | Specification-driven contract (canonical).             |
| `kanban-board.ts`        | Implementation. Vanilla TypeScript custom element.      |
| `kanban-board.test.ts`   | Vitest + jsdom spec, one or more assertions per §8.     |
| `index.ts`               | Barrel re-export + side-effectful `customElements.define`. |
| `index.md`               | User guide.                                              |

## Public surface

- Custom element tag: `kanban-board`.
- Class export: `KanbanBoard`.
- Type exports: `KanbanBoardProps`, `KanbanBoardMoveDetail`,
  `KanbanColumn`, `KanbanCard`, `KanbanLabels`.
- Function export: `nextKanbanBoardId` (SSR-safe id generator).

Observed attributes: `label` (required), `caption`, `class`.
Property-only: `columns` (required), `cards` (required), `cardLabel`,
`onMove`, `labels` — arrays of objects and functions cannot be
attributes (mirrors `date-time-picker`'s §4.3 precedent).

Event: `movecard` (`CustomEvent<{cardId, toColumnId}>`), paired with the
`onMove` property.

## Behaviour contract (one paragraph)

Cards render in a rectangular grid: rows correspond to a card's position
within its column, columns to `KanbanColumn`. Shorter columns pad with
empty, non-card cells so every column has the same row count as the
tallest one. Keyboard follows the WAI-ARIA APG Grid roving-tabindex
model — one cell `tabindex="0"` at a time, arrow keys move it and
clamp, `Home`/`End`/`Ctrl+Home`/`Ctrl+End` jump within/across the grid.
Moving a card is never arrow-key-drag-only: Enter/Space on a focused
card opens a "Move to…" popup listing destination columns, its keyboard
behaviour driven by `ListboxController` in clamped-cursor mode. Pointer
drag-and-drop (native HTML5) is supplementary, not the only path. A
column's `wipLimit`, once exceeded, marks the column `data-over-limit`
— a styling hook, not an enforced block. Every successful move announces
through one `.kanban-board-status[aria-live="polite"]` region built from
a caller-supplied `labels.moveAnnouncement`.

## The move-menu button-identity bug — and how this port avoids it

Every other framework catalog's kanban-board port (React, Vue, Angular,
Blazor, Web Components) independently found the same latent bug in the
Svelte canonical: its move-menu binds ONE shared element reference
across every card's move button, so closing a menu refocuses whichever
card's button rendered LAST, not the card whose menu actually closed.
This port keeps `#moveButtonEls: Map<cardId, HTMLButtonElement>` instead
of a scalar field, which makes the bug structurally impossible — every
lookup is keyed by the card whose menu is actually closing.
`kanban-board.test.ts` has a dedicated regression test (opens/closes two
different cards' menus in sequence, asserts DOM-node identity via
`toBe`, not a class-name string) — verified load-bearing by temporarily
reintroducing the bug and confirming both that test and the pre-existing
§8.8 test fail. See spec/index.md §10.3.

## HTML

See [spec/index.md §5](./spec/index.md#5-html) for the full markup
shape. Root: `<div class="kanban-board {class}">` wrapping a hand-built
`<table class="kanban-table" role="grid">` and the per-card move-menu
popup, which renders inline inside the focused card's `<td>`.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, set directly — the headless
  `kanban-table` contract specifies no default role, so there's no
  conflict to resolve).
- Roving tabindex, not `aria-activedescendant`, for the board itself.
  The "Move to…" menu uses active-descendant mode internally (a
  `ListboxController`-driven popup, not the grid).
- The move menu is the accessible path for card movement; drag is
  supplementary, never required.
- One `aria-live="polite"` region for all move announcements.

## Conventions this package follows

- Vanilla custom element, no framework runtime, no `lily-` tag prefix
  (unlike the Web Components catalog).
- Strict TypeScript.
- Depends on `@lilydesignsystem/html-headless` (for
  `ListboxController`) as a real npm dependency, external in the built
  output (verified: `dist/index.js` imports it as a bare specifier, no
  bundled class body).
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` property; a label's presence
  gates the control it names — no baked-in English fallback.
- Every table part built exclusively via `document.createElement`/
  `appendChild`, never `innerHTML`/template strings (HTML5 table-parser
  safety — see spec §3).
- Non-goals (multi-select/bulk move, swimlanes, card detail editing,
  virtualization, column reorder, card sub-tasks) are documented, not
  silently missing — see spec/index.md §9.

## Testing

`npx vitest run lily-design-system-html-kanban-board/kanban-board.test.ts`
from the `lily-design-system-html-helpers` workspace root. 16 tests, one
or more assertions per §8 clause, plus the dedicated move-menu-identity
regression test.
