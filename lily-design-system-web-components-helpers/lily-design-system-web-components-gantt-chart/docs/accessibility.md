# Accessibility — `<lily-gantt-chart>`

WCAG 2.2 AA target; WAI-ARIA APG Grid pattern.

## WCAG 2.5.7 (Dragging Movements)

Rescheduling/resizing a task is never drag-only. Enter/Space on a
focused non-parent row opens an inline edit region built from two
composed `<lily-date-time-picker>` instances — a fully independent
keyboard path to the same outcome a pointer drag reaches. Gated on
`labels.dateTimePickerLabels` being supplied, since `date-time-picker`
itself requires that object; callers who omit it lose the keyboard
edit path entirely, a real (if narrow) gap this component cannot fix
on the caller's behalf, exactly mirroring `kanban-board`'s move-button
tradeoff.

## Dependency data, never a dependency arrow

`task.dependsOn` renders as `aria-describedby` text
(`labels.dependencySummary`), never a drawn connector line between
bars. This is a documented non-goal, not an oversight: the Svelte
reference's own spec cites two commercial Gantt libraries' own
accessibility documentation treating dependency-arrow rendering as
industry-wide unsolved, not something uniquely skipped here.

## `data-in-range` vs. the roving-tabindex cursor

These are two independent attributes on the same `<td>`. A task's bar
can span many cells (`data-in-range` on all of them); the
roving-tabindex cursor is exactly one cell grid-wide
(`tabindex="0"`/`aria-selected="true"`). Conflating them — as reusing
a single `active`-style prop for both would — puts more than one cell
at `tabindex="0"` whenever a bar spans more than one column, a real
regression, not a style choice. See spec/index.md §3.

## Row headers sit outside the roving-tabindex column index

Each row's `<th scope="row">` (task label + collapse button, for
parent rows) is not part of the grid's `data-col` numbering. This
matches `data-grid`'s own treatment of toolbar controls: a grid's
roving-tabindex model applies to its data cells, not to every
focusable thing inside the grid's DOM subtree.

## Composed `<lily-date-time-picker>`'s own accessibility contract

The edit region's two pickers are that package's own component,
unmodified — see its own `docs/accessibility.md` for its keyboard
contract, dialog semantics, and known tradeoffs. This component does
not re-document them.
