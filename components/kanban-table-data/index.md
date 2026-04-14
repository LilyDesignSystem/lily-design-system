# Kanban Table Data

A Kanban board item is a component that represents a single work item or task card within a Kanban board column. Each item typically displays summary information about a task, such as its title, assignee, priority, or due date, and serves as the unit that moves between workflow stages.

This component is designed to be used as a child element within a Kanban column that has `role="list"`. It renders as a `<div>` with `role="listitem"` to convey its semantic position within the list, supports an optional accessible label for screen reader identification, and allows consumers to render any content inside it through the children slot.

## Implementation Notes

- Renders as a `<div>` with `role="listitem"` for proper list semantics within a parent `role="list"` container
- Designed to be used inside a Kanban column; the parent column provides the `role="list"` context
- Optional `label` prop sets `aria-label` for screen reader identification of the card
- All card content is provided through the `children` slot
- Uses props for prop destructuring with rest props spread
- No drag-and-drop behavior built in; consumers implement interaction as needed

## Props

- `label`: string (optional) -- accessible label for the card via `aria-label`
- `children`: slot (required) -- card content (title, assignee, metadata, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Usage

Task card with title and assignee:

```html
<KanbanTableData label="Fix login bug">
    <h3>Fix login bug</h3>
    <p>Assigned to Alice</p>
    <span>High priority</span>
</KanbanTableData>
```

Dynamic task card with data binding:

```html
<KanbanTableData label={task.title}>
    <span>{task.title}</span>
    <span>{task.priority}</span>
    <span>{task.assignee}</span>
</KanbanTableData>
```

## Keyboard Interactions

- None directly -- keyboard interaction depends on interactive elements within the card content provided by the consumer

## ARIA

- `role="listitem"` -- identifies this as an item within a list container (the parent Kanban column with `role="list"`)
- `aria-label` -- optional accessible name for the card, set from the `label` prop, allowing screen readers to identify individual cards

## When to Use

- Use inside KanbanTable to represent a single work item or task card within a board column.
- Use when each card needs an accessible label and listitem semantics within a list container.
- Use for displaying task summaries including title, assignee, priority, or due date.

## When Not to Use

- Do not use outside of a KanbanTable context -- use TableData or DataTableData for general tables.
- Do not use for column headings -- use KanbanTableCol instead.

## Headless

This headless component provides semantic listitem structure with `role="listitem"` and optional `aria-label` for accessible card identification. The consumer provides all visual styling, including card layout, colors, shadows, drag handles, and any interactive affordances.


## Styles

The consumer provides all CSS styling. The component renders with a `.kanban-table-data` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<td>` element with class `kanban-table-data`
- Verify role="listitem"` -- identifies this as an item within a list container (the parent Kanban column with `role="list"`)
- Verify aria-label` -- optional accessible name for the card, set from the `label` prop, allowing screen readers to identify individual cards
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Design cards with a clear visual hierarchy so that the title, assignee, and priority are scannable at a glance across columns.
- **Developers**: Always provide a descriptive `label` prop so screen reader users can distinguish individual cards without reading all card content.

## Composition

KanbanTableData is the leaf component in the KanbanTable compound pattern. It is placed inside column containers within KanbanTableBody, where each column uses `role="list"`.

```
KanbanTable → KanbanTableBody → column (role="list") → KanbanTableData (role="listitem")
```

## References

- WAI-ARIA Listitem Role: https://www.w3.org/TR/wai-aria-1.2/#listitem
