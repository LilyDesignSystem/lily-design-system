# KanbanBoard (Svelte helper)

A reusable Svelte 5 headless **interactive kanban board**. It composes
`@lilydesignsystem/svelte-headless`'s `KanbanTable` family — the same
`role="grid"` container the headless catalog ships, with zero
behaviour built in — and the same `IconButton`/`Listbox` pair every
picker helper already depends on, reused here as a per-card "Move
to…" action menu. Ships no CSS: every visual detail is the consumer's,
via kebab-case class hooks.

Cards move between columns two ways, deliberately never drag-only:
pointer drag-and-drop, and a keyboard-accessible move menu. Native
drag-and-drop fails WCAG 2.5.7 (Dragging Movements); the research
behind this package (see [spec/index.md](./spec/index.md)) found that
the accessible alternative real products ship is an action menu
listing destination columns, not arrow-key dragging.

## Usage

```svelte
<script lang="ts">
  import KanbanBoard from "@lilydesignsystem/svelte-kanban-board";
  import type { KanbanColumn, KanbanCard } from "@lilydesignsystem/svelte-kanban-board";

  const columns: KanbanColumn[] = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress", wipLimit: 3 },
    { id: "done", title: "Done" },
  ];

  let cards = $state<KanbanCard[]>([
    { id: "1", columnId: "todo", title: "Design the empty state" },
    { id: "2", columnId: "doing", title: "Wire up the API" },
  ]);

  function handleMove(cardId: string, toColumnId: string) {
    cards = cards.map((c) => (c.id === cardId ? { ...c, columnId: toColumnId } : c));
  }
</script>

<KanbanBoard
  label="Sprint 12 board"
  {columns}
  {cards}
  onMove={handleMove}
  labels={{
    cardCount: (count) => `${count} card${count === 1 ? "" : "s"}`,
    overLimit: (count, limit) => `Over limit: ${count} of ${limit}`,
    moveButton: (card) => `Move ${card.title}`,
    moveMenuLabel: "Move to column",
    moveAnnouncement: (title, column) => `${title} moved to ${column}`,
  }}
/>
```

## Props

See [spec/index.md §5](./spec/index.md#5-props) for the full table.
Required: `label`, `columns`, `cards`. Every optional `labels.*` field
gates the control it names — omit a label and that control simply
doesn't render (no baked-in English fallback).

## Behaviour

- **Rectangular grid**: the body has as many rows as the largest
  column's card count; shorter columns pad with empty cells.
- **Card move — pointer**: native HTML5 drag-and-drop between columns.
- **Card move — keyboard**: Enter/Space on a focused card opens a
  "Move to…" listbox of destination columns — not arrow-key dragging.
- **WIP limits**: `column.wipLimit` triggers a warning state
  (`data-over-limit`) once a column's card count exceeds it.
- **Keyboard**: WAI-ARIA APG Grid roving-tabindex, the same model
  `data-grid` uses — arrows move within/across columns and clamp,
  Home/End jump within a column, Ctrl+Home/Ctrl+End jump to the
  grid's ends.
- **Announcements**: every move announces via one `aria-live="polite"`
  region.
- **Typed fields and editing** (0.6.0): `fields` + `card.values` show typed values under the title; `onFieldEdit` makes editable types edit in place (click, or F2). See [spec §17](./spec/index.md#17-typed-fields-inline-editing-export-hot-path-caching-060-2026-10-16).
- **Export** (0.6.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown (or selected) cards.

## Export: copy to clipboard (0.7.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same cards, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## Search (0.7.0)

`search` (bindable; the field renders when `labels.search` names it) narrows the cards: every word must appear, in any order, ignoring case and diacritics. The default text is the card's label, subtitle, badges and every typed field's text. Matches in the title are wrapped in `<mark class="kanban-board-match">` (link titles too); `labels.searchAnnouncement(matches, total)` is announced; Escape in the field clears it. See spec §18.

## Non-goals (v1)

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns. See
[spec/index.md §9](./spec/index.md#9-non-goals) for why each is out.

---

Lily™ and Lily Design System™ are trademarks.
