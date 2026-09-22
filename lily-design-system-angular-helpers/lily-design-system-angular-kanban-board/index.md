# Lily Design System™ — Angular KanbanBoard

A headless, interactive kanban board: cards move between columns by
pointer drag-and-drop or, independently, by a keyboard-accessible
per-card "Move to…" menu — never drag-only. Ports
[`@lilydesignsystem/svelte-kanban-board`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/index.md)
to Angular 20.

## Install

```sh
npm install @lilydesignsystem/angular-kanban-board
```

`@lilydesignsystem/angular-headless` installs automatically as a
regular dependency — `KanbanBoard` composes its `KanbanTable` family
and `IconButton`/`Listbox`, not a reimplementation.

## Usage

```ts
import { Component } from "@angular/core";
import { KanbanBoard, type KanbanMoveEvent } from "@lilydesignsystem/angular-kanban-board";

@Component({
  selector: "app-board",
  standalone: true,
  imports: [KanbanBoard],
  template: `
    <lily-kanban-board
      label="Sprint board"
      [columns]="columns"
      [cards]="cards"
      [labels]="labels"
      (move)="onMove($event)"
    />
  `,
})
export class BoardComponent {
  columns = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress", wipLimit: 3 },
    { id: "done", title: "Done" },
  ];

  cards = [
    { id: "c1", columnId: "todo", title: "Write the spec" },
    { id: "c2", columnId: "doing", title: "Build the component" },
  ];

  labels = {
    cardCount: (count: number) => `${count} cards`,
    overLimit: (count: number, limit: number) => `${count} of ${limit} — over limit`,
    moveButton: (card: { title: string }) => `Move ${card.title}`,
    moveMenuLabel: "Move to column",
    moveAnnouncement: (title: string, column: string) => `${title} moved to ${column}`,
  };

  onMove({ cardId, toColumnId }: KanbanMoveEvent): void {
    const card = this.cards.find((c) => c.id === cardId);
    if (card) card.columnId = toColumnId;
  }
}
```

## Behaviour

- **Rendering.** Cards render as a rectangular grid: rows are a card's
  position within its column, columns are `KanbanColumn`s. Shorter
  columns pad with empty cells.
- **Moving a card — keyboard (the primary path).** Focus a card cell
  (roving `tabindex`, WAI-ARIA APG Grid pattern) and press Enter or
  Space to open its "Move to…" menu; choose a destination column to
  move it. Escape closes without moving.
- **Moving a card — pointer.** Drag a card's title onto another
  column's cell. Supplementary to the keyboard path, never the only
  way to move a card — WCAG 2.5.7 requires a non-dragging alternative
  for any drag-based interaction.
- **WIP limits.** `column.wipLimit`, once exceeded, marks that
  column's header `data-over-limit` — style the warning state
  yourself; nothing is blocked.
- **Announcements.** Every move is announced through one
  `aria-live="polite"` status region, built from
  `labels.moveAnnouncement`.

## Labels

Every user-facing string is optional on `KanbanLabels`, and its
presence gates the control it names — omit `labels.overLimit` and no
WIP warning text renders (the `data-over-limit` attribute still does,
as a pure styling hook); omit `labels.moveAnnouncement` and nothing is
announced. There is no built-in English text anywhere in this package.

## Accessibility

WAI-ARIA APG Grid pattern throughout — see
[spec/index.md §7](./spec/index.md#7-accessibility) for the full
contract, and §3 for the small number of places this port fills a gap
in Angular's own headless `KanbanTable` (no `role="grid"`, no
`caption` input) rather than modifying that package.

## Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns — see
[spec/index.md §9](./spec/index.md#9-non-goals).
