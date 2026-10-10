# Accessibility — `<kanban-board>`

## Why card movement is never keyboard-drag-only

WCAG 2.5.7 (Dragging Movements) requires a single-pointer, non-dragging
alternative for any function that can be operated by dragging. Atlassian's
own Pragmatic Drag and Drop accessibility research (cited by the Svelte
canonical this package ports) documents that even sighted, motor-typical
users routinely fail keyboard-drag reimplementations of drag-and-drop —
the interaction model itself, not just its assistive-technology mapping,
is the problem. `<kanban-board>` therefore treats the per-card "Move
to…" menu as the primary, always-present path; native HTML5 drag-and-drop
is supplementary.

## Roving tabindex, not `aria-activedescendant`, for the grid

The grid itself uses the WAI-ARIA APG Grid pattern's roving-tabindex
model: exactly one `.kanban-table-td` carries `tabindex="0"` at a time,
moved by arrow keys. This matches every other grid-shaped helper in the
Lily ecosystem (`data-grid`, `gantt-chart`). The move menu that opens
*inside* a focused cell uses `aria-activedescendant` instead — the
correct pattern for a transient popup listbox, and the reason it is
implemented as a separate, nested widget rather than folded into the
grid's own navigation.

## The move-menu button-identity fix

See [spec/index.md §10.3](../spec/index.md#10-deviations-from-the-svelte-canonical)
for the full account of the cross-catalog shared-button-reference bug
this package's `Map<cardId, HTMLButtonElement>` design avoids. The
practical accessibility consequence, if it had shipped: closing a move
menu would silently move keyboard focus to an unrelated card's button —
a focus-management failure a screen-reader user would experience as
"the cursor jumped somewhere else for no reason."

## Live region

A single `.kanban-board-status[aria-live="polite"]` element announces
every successful move. It renders only when `labels.moveAnnouncement` is
supplied — this package never invents English text.
