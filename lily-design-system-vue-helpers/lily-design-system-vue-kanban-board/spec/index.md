# KanbanBoard — Specification (Vue helper)

Canonical contract: [the Svelte package's spec/index.md](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/spec/index.md)
(implemented first, 2026-09-22). This port mirrors its § numbering;
where the two disagree, the Svelte side wins. Differences here are
strictly Vue-API-surface translations (props → `defineProps`/`emit`
events), never behaviour changes.

## 1. Purpose

A headless control that turns a set of cards and columns into an
interactive kanban board: cards move between columns by pointer
drag-and-drop or, independently, by a keyboard-accessible per-card
"Move to…" menu — never drag-only. WAI-ARIA APG Grid roving-tabindex
keyboard navigation. The component owns state and behaviour; it does
not own the grid's base markup.

## 2. Scope

Same as the Svelte canonical §2. In scope: rendering a board from
`columns`/`cards` data, pointer drag-and-drop between columns, a
keyboard-accessible move menu per card, WIP (work-in-progress) limits
with a warning state, derived card counts, APG grid roving-tabindex
keyboard navigation, and `aria-live` move announcements.

Out of scope (v1 non-goals, not silent gaps — see §9): drag-preview/
ghost-element rendering, virtualization, undo/redo, column reordering,
swimlanes, card selection/bulk-move, search/filter, collapsible
columns.

## 3. Composition

`KanbanBoard` depends on `@lilydesignsystem/vue-headless`'s
`KanbanTable`, `KanbanTableHead`, `KanbanTableBody`, `KanbanTableRow`,
`KanbanTableTH`, `KanbanTableTD` as a real npm dependency and renders
them unmodified. It also depends on `IconButton` and `Listbox` (the
same headless components the Vue picker helpers compose) for the
per-card move-menu trigger and the menu itself — a button-opens-listbox
popup, anchored to a grid cell instead of a page header, mirroring
`theme-picker`'s own `IconButton`/`Listbox` composition (see
`spec/helpers/index.md`'s "Composition with the headless layer" §
"Per-catalog composition summary" row for `vue`). `KanbanTable` keeps
owning `<table role="grid">` and its `aria-label`; `KanbanTableTD`'s
existing `active` prop (roving `tabindex`/`aria-selected`) is reused
as-is for body cells — Vue's own `KanbanTableTD` carries no overload of
`active` the way `GanttTableTD` does (see the `gantt-chart` spec §3 for
that finding), so no workaround is needed here.

## 4. HTML

```html
<div class="kanban-board {class}">
  <KanbanTable :label="label" :caption="caption" @keydown="onGridKeydown">
    <KanbanTableHead>
      <KanbanTableRow>
        <KanbanTableTH data-over-limit>            <!-- only when column.wipLimit is exceeded -->
          {{ column.title }}
          <span class="kanban-board-count">{{ labels.cardCount(count) }}</span>
          <span class="kanban-board-wip-warning">{{ labels.overLimit(count, limit) }}</span>  <!-- only when over limit -->
        </KanbanTableTH>
      </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
      <KanbanTableRow>
        <KanbanTableTD>                             <!-- active = the roving-tabindex cursor -->
          <span class="kanban-board-card-title">{{ cardLabel(card) }}</span>
          <button class="kanban-board-move-button" aria-haspopup="listbox" aria-expanded>…</button>
          <Listbox class="kanban-board-move-list" role="listbox">  <!-- only while open -->
            <li role="option">{{ destinationColumn.title }}</li>
          </Listbox>
        </KanbanTableTD>
      </KanbanTableRow>
    </KanbanTableBody>
  </KanbanTable>
  <p class="kanban-board-status" aria-live="polite"></p>
</div>
```

## 5. Props and events

| Prop        | Type                              | Required | Default |
| ----------- | ---------------------------------- | -------- | ------- |
| `label`     | `string`                            | yes      | —       |
| `columns`   | `KanbanColumn[]`                    | yes      | —       |
| `cards`     | `KanbanCard[]`                      | yes      | —       |
| `caption`   | `string`                             | no       | —       |
| `cardLabel` | `(card: KanbanCard) => string`       | no       | `card.title` |
| `labels`    | `KanbanLabels`                       | no       | `{}`    |
| `class`     | `string`                             | no       | `""`    |

| Event  | Payload                        | Fires                                                        |
| ------ | -------------------------------- | -------------------------------------------------------------- |
| `move` | `(cardId: string, toColumnId: string)` | After a card moves to a new column, by pointer or by the move menu. |

Vue separates props from events by design (matching `picker-bar`'s and
`date-time-picker`'s own precedent): the Svelte canonical's `onMove`
callback prop is this port's `move` emit.

`KanbanColumn`: `id` (required), `title` (required), `wipLimit?: number`.

`KanbanCard`: `id` (required), `columnId` (required), `title`
(required). Card order within a column follows the order cards appear
in the `cards` array.

`KanbanLabels` — every field optional, but its presence gates the
control it names, matching every other helper's label-gating
convention: `cardCount(count)`, `overLimit(count, limit)`,
`moveButton(card)` (accessible name for the per-card move trigger),
`moveMenuLabel` (accessible name for the move listbox),
`moveAnnouncement(cardTitle, columnTitle)`.

## 6. Behaviour

Identical to the Svelte canonical §6:

**Rendering.** Cards are grouped by `columnId` and rendered as a
rectangular grid: the number of body rows equals the largest column's
card count, and a column with fewer cards pads its remaining rows with
empty `KanbanTableTD` cells.

**Card move — pointer.** Native HTML5 drag-and-drop: a card is
`draggable`; dropping it on another column's cell moves it there via
the same path the keyboard path uses. Supplementary, not primary.

**Card move — keyboard.** Enter/Space on a focused card cell opens
that card's own "Move to…" menu (a headless `Listbox` in
`navigation="active-descendant"` mode); choosing a destination column
emits `move`, closes the menu, returns focus to the move-button, and
announces the result. Escape closes without moving.

**WIP limits.** `column.wipLimit`, when set, is compared against that
column's current card count; a column at or over its limit carries
`data-over-limit` on its header cell and renders `labels.overLimit`'s
text — rendered only when `labels.overLimit` is supplied.

**Announcements.** Every move writes a string to a single
`kanban-board-status` `aria-live="polite"` region, built from
`labels.moveAnnouncement`.

**Keyboard.** WAI-ARIA APG Grid pattern, the same roving-tabindex
model as `data-grid`: exactly one body cell carries `tabindex="0"` at
a time. `ArrowUp`/`ArrowDown` move within a column and clamp;
`ArrowLeft`/`ArrowRight` move across columns and clamp;
`Home`/`End` jump to the first/last row of the current column;
`Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell;
`Enter`/`Space` opens the focused card's move menu.

**SSR.** All DOM writes inside Vue's mount lifecycle (`onMounted`,
watchers); server render emits `cards` in their given order with no
move menu open.

## 7. Accessibility

Same as the Svelte canonical §7: WAI-ARIA APG Grid pattern
(`role="grid"`, inherited from `KanbanTable`). Roving-tabindex focus
management for body cells. The move menu follows the exact same
icon-button-opens-listbox contract every Vue preference picker uses
(`aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` via the
listbox's own generated id where applicable, `aria-activedescendant`
inside the open listbox). State changes are announced through one live
region.

## 8. Acceptance criteria

Same clauses as the Svelte canonical, restated for the Vue surface:

- §8.1 Renders `<div class="kanban-board">` wrapping a `KanbanTable`
  whose `role="grid"` and `aria-label` come from `label`.
- §8.2 Renders one `KanbanTableTH` per column with its title and, when
  `labels.cardCount` is supplied, a derived card count.
- §8.3 A column at or over `wipLimit` carries `data-over-limit` and
  renders `labels.overLimit`'s text; a column under its limit, or with
  no `wipLimit` set, carries neither.
- §8.4 Cards render as a rectangular grid: the body has as many rows
  as the largest column's card count, and shorter columns pad with
  empty cells rather than shifting other columns' rows.
- §8.5 Exactly one body cell (`.kanban-table-td`) carries
  `tabindex="0"` at any time; arrow keys move it and clamp at the
  grid's edges rather than wrapping.
- §8.6 `Home`/`End` move within the current column;
  `Ctrl+Home`/`Ctrl+End` move to the grid's first/last cell.
- §8.7 Enter/Space on a focused card opens that card's own move menu
  (`aria-haspopup="listbox"`, `aria-expanded` toggles, a
  `role="listbox"` of destination columns appears).
- §8.8 Choosing a destination column in the move menu emits `move`
  with the card's id and the destination column's id, closes the
  menu, and returns focus to the move button.
- §8.9 Escape closes the move menu without emitting `move`.
- §8.10 A pointer drag-and-drop of a card onto another column's cell
  emits `move` the same way the keyboard path does.
- §8.11 Every successful move writes an announcement to
  `kanban-board-status` (`aria-live="polite"`) built from
  `labels.moveAnnouncement`; no announcement fires when that label is
  absent.
- §8.12 Extra attributes spread onto the root `<div>` (Vue's default
  single-root `inheritAttrs`).
- §8.13 No hardcoded user-facing strings: every label comes from a
  prop or a `labels.*` function.

## 9. Non-goals

Same as the Svelte canonical §9: drag-preview/ghost-element rendering,
virtualization, undo/redo, column reordering, swimlanes, card
selection/bulk-move, search/filter, collapsible columns.

## 10. Relationship to the headless layer and other helpers

`KanbanBoard` composes two different headless shapes in one package:
the structural `KanbanTable` family (matching `data-grid`'s
relationship to `DataTable`) and the interactive `IconButton`/`Listbox`
pair every Vue picker helper already depends on. Follows every other
Vue helper's established rules: headless (no bundled CSS), SSR-safe,
i18n-clean (label-presence gates each control), `<script setup
lang="ts">` Composition API. Each `IconButton`/`Listbox` instance
inside the per-card move menu is captured via a function `ref` (a Map
keyed by card id for the buttons, a single variable for the one open
listbox) rather than a static `ref="…"` name, because a static ref
name lexically inside a `v-for` collects into an array under Vue's own
rules — see `KanbanBoard.vue`'s own comment for the reasoning, and
`shims.d.ts` for the `vue-tsc` declaration-pass workaround this
package needs (an existing convention already used by every other Vue
helper that composes `@lilydesignsystem/vue-headless`).
