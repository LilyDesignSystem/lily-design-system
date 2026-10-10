# Accessibility — KanbanBoard

## WAI-ARIA pattern

The board is a [WAI-ARIA APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/):
`role="grid"` on the `<table>` (set explicitly by `kanban-board.njk`
via `attributes: {role: "grid"}` — none of the composed kanban-table
macros set a default role), roving `tabindex` across body cells, one
`tabindex="0"` cell at a time.

## Why the move menu, not arrow-key dragging

WCAG 2.5.7 Dragging Movements requires that any functionality
operable by a dragging movement also be operable by a single pointer
without dragging, unless dragging is essential. A kanban board's card
move is not essential-to-drag: a menu achieves the identical outcome.
This helper's move menu is the ACCESSIBLE path, not a fallback —
Enter/Space on a focused card opens it with no pointer involved at
all, and it works identically whether or not the consumer's page ever
wires up drag-and-drop event listeners.

## The move menu itself

Each card's move button is `aria-haspopup="listbox"` with
`aria-expanded` and `aria-controls` pointing at its own listbox.
Opening moves focus to the `<ul role="listbox">`; the active option is
conveyed via `aria-activedescendant`, managed by
`@lilydesignsystem/nunjucks-listbox-behavior`'s `createListboxKeyboard`
— the same shared module theme-picker, locale-picker, text-size-picker
and motion-picker's own client.js already depend on.

## Announcements

Every successful move — by either path — writes to one
`.kanban-board-status[aria-live="polite"]` region, built from
`labels.moveAnnouncement`. Keep this region visible by default: it
helps sighted and cognitive-accessibility users too, not only screen
reader users.

## The shared-ref regression this port avoids

See [spec/index.md §10](../spec/index.md#10-shared-ref-regression-rigor-note).
Every other framework catalog's own kanban-board port found the same
bug in the Svelte canonical (a single shared "last opened button"
reference refocusing the wrong card after closing a menu). This port's
architecture — one permanent DOM node per card, looked up by card id,
never through a single mutable reference — cannot reproduce it.
