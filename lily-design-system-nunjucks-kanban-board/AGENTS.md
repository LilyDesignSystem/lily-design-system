# AGENTS — KanbanBoard (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it
first; everything below is a fast index.

## What this package is

A macro + client.js Nunjucks port of `@lilydesignsystem/svelte-kanban-
board`: a keyboard-and-pointer-accessible kanban board (WAI-ARIA APG
Grid, per-card "Move to…" menu, drag-and-drop supplementary). It
composes `@lilydesignsystem/nunjucks-headless`'s kanban-table macro
family (a real npm dependency, unmodified) for the grid's structural
markup, and `@lilydesignsystem/nunjucks-listbox-behavior`'s
`createListboxKeyboard` for the move menu's own APG listbox keyboard
contract — the same shared module every picker helper's `client.js`
already depends on. Ships no CSS.

Ported from the Svelte canonical
(`lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board`,
2026-09-21) on 2026-09-22.

## Files

| File | Purpose |
| --- | --- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `kanban-board.njk` | The macro. |
| `kanban-board.client.js` | The ES-module runtime. |
| `kanban-board.test.ts` | Vitest spec, one or more assertions per §9 acceptance clause. |
| `index.md` | User guide. |
| `docs/` | Deep-dive topic guides. |
| `examples/` | Runnable Nunjucks templates. |
| `CHANGELOG.md` | Version history. |

## Public surface

- Macro: `kanbanBoard(opts)`, exported from `kanban-board.njk`.
- Client.js exports: `initKanbanBoard(root, opts?)`, `autoInit(opts?)`.

Required macro params: `label`, `columns`, `cards`.

## Behaviour contract (one paragraph)

Cards render in a rectangular grid: rows correspond to a card's
position within its column, columns to `columns[]`. Shorter columns
pad with empty, non-tabbable cells so every column has the same row
count as the tallest one. Keyboard follows the WAI-ARIA APG Grid
roving-tabindex model — one cell `tabindex="0"` at a time. Moving a
card is never arrow-key-drag-only: Enter/Space on a focused card opens
a "Move to…" `<ul role="listbox">` listing destination columns.
Pointer drag-and-drop (native HTML5) is supplementary, not the only
path. A column's `wipLimit`, once exceeded (including `wipLimit: 0`),
marks the column `data-over-limit` — a styling hook, not an enforced
block. Every successful move announces through one
`.kanban-board-status aria-live="polite"` region built from a
caller-supplied `labels.moveAnnouncement`.

## HTML

See [spec/index.md §6](./spec/index.md#6-html) for the full markup
shape. Root: `<div class="kanban-board {classes}">` wrapping the
kanban-table macro family and the move-menu `<ul>`, which renders
inline in every card cell, always present in the DOM and toggled via
`hidden` — never conditionally rendered.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, set explicitly by this
  macro — none of the kanban-table macros set a default role).
- Roving tabindex, not `aria-activedescendant`, for the board itself.
  The "Move to…" menu uses `aria-activedescendant` mode internally (a
  `role="listbox"` popup, not the grid), via `createListboxKeyboard`.
- The move menu is the accessible path for card movement; drag is
  supplementary, never required — see spec/index.md §7 and
  spec/helpers/index.md for the WCAG 2.5.7 rationale.
- One `aria-live="polite"` region for all move announcements.

## Nunjucks gotchas

- A variable introduced with `{% set %}` in an enclosing macro body is
  NOT visible inside a nested `{% call otherMacro() %}...{% endcall %}`
  body — only that body's own loop variables and the enclosing macro's
  OWN parameters are. Every nested composition in `kanban-board.njk`
  is instead built with plain macro-call expressions
  (`{{ someMacro(args) }}`) and each headless macro's `html`/
  `attributes` params, bottom-up, as `| safe`-marked HTML strings, with
  every value the leaf needs threaded as an explicit macro parameter.
  See spec/index.md §5.
- `selectattr("x", "equalto", v)` did not reliably filter card/column
  lists in this Nunjucks version during development; card grouping by
  column is built with explicit `for`-loop + `.concat()` accumulation
  instead (see `kanban-board.njk`'s own `_kanbanBoardHeaderRowHtml`
  and the main `kanbanBoard` macro body).

## Conventions this package follows

- Plain JS (JSDoc types) for `kanban-board.client.js`, matching every
  other helper in this catalog.
- Depends on `@lilydesignsystem/nunjucks-headless` and
  `@lilydesignsystem/nunjucks-listbox-behavior` as real npm
  dependencies — never vendors their markup or keyboard logic.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` macro param (template
  strings, gated by presence) or a `labels.*` client.js init option (a
  real function, for controls that only ever render after hydration) —
  see spec/index.md §4's deviation table. No baked-in English
  fallback.
- Non-goals (drag-preview rendering, virtualization, undo/redo, column
  reorder, swimlanes, card selection/bulk-move, search/filter,
  collapsible columns) are documented, not silently missing — see
  spec/index.md §2.
- The shared-ref regression every other framework catalog's own port
  independently found in the Svelte canonical's move-menu (a single
  mutable "last button" reference) cannot occur here by construction —
  see spec/index.md §10.
