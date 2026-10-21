# Lily Design System™ — Alpine.js KanbanBoard — Specification

Living specification. Project-wide rules: [root spec](../../spec/index.md). The contract is the Svelte reference
([spec](../../lily-design-system-svelte-kanban-board/spec/index.md)); where they differ, Svelte wins.

## 1. Scope

### Built (0.1.0)

- `columns` (`wipLimit`), `cards`, `cardLabel`, labels `cardCount`, `overLimit`, `moveButton`, `moveMenu`, `moveAnnouncement`,
  `moveBlocked`, `grid`, `caption`.
- A `role="grid"` table with a rectangular grid of cells, a roving tabindex, and the shared APG grid keys (`grid-navigation`) with
  right-to-left (`direction`) and type-ahead (`typeahead`).
- Moves by drag and drop, the keyboard move menu (`aria-haspopup`, `aria-expanded`, `aria-activedescendant`) and Alt+Arrow;
  `canMove` and `strictWip` refuse a move and announce it; the cursor follows the moved card.
- `data-drop-target` / `data-drop-blocked` while dragging; `data-over-limit` on a column over its limit.

### Not built yet

Typed card fields and inline editing, column reorder (Alt+Shift+Arrow), card selection, search, undo, export, `onMove` rejection
(server-side refusal), touch drag, card order within a column (a moved card joins the end).

## 2. Rules

- No CSS, no text, no icons; every string is a `labels.*` value.
- Shared pure modules are copies of `shared/`; edit `shared/`.

## 3. Acceptance criteria

- [x] `pnpm test` passes (rendering, menu, Alt+Arrow, rules, drag and drop, keyboard).
- [x] `pnpm build` emits `dist/` with types.
- [x] Tests were checked by breaking the code (WIP strictness, same-column move, drop-target cue, right-to-left, Escape).
- [ ] The not-built list above.

## Related topics

[helpers](../../spec/helpers/index.md), [Alpine headless](../../lily-design-system-alpine-headless/spec/index.md).

Lily™ and Lily Design System™ are trademarks.
