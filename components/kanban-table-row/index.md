# Kanban Table Row

KanbanTableRow is a headless component that renders a `<tr>` element within a kanban board table. It represents a single row containing kanban items across status columns.

Use this component within KanbanTableHead, KanbanTableBody, or KanbanTableFoot to define rows of kanban board items.

## Implementation Notes

- Renders a `<tr>` element for table row semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<tr>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the row
- `children`: slot (required) -- row cells, typically KanbanTableData components
- `...restProps`: unknown -- additional attributes spread onto the `<tr>` element

## Usage

Row of kanban items across status columns:

```html
<KanbanTableBody>
    <KanbanTableRow>
        <KanbanTableData label="Fix login bug">Fix login bug</KanbanTableData>
        <KanbanTableData label="Add dashboard">Add dashboard</KanbanTableData>
        <KanbanTableData label="Setup CI/CD">Setup CI/CD</KanbanTableData>
    </KanbanTableRow>
</KanbanTableBody>
```

## Keyboard Interactions

Standard table row keyboard interactions.

## ARIA

No additional ARIA attributes. Row semantics are provided by the `<tr>` element.

## When to Use

- Use inside KanbanTableHead, KanbanTableBody, or KanbanTableFoot to define a row of kanban items.
- Use to group KanbanTableData cells that represent items across status columns.
- Use for each horizontal row of content in the kanban board.

## When Not to Use

- Do not use outside of a KanbanTable context -- use TableRow or DataTableRow for general tables.
- Do not use for column headings directly -- place heading content inside KanbanTableCol within the row.

## Headless

This headless component renders a `<tr>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.kanban-table-row` class for targeting.

## Testing

- Verify the component renders a `<tr>` element
- Verify children content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use visual separators between rows for clarity. Consider hover states for interactive rows.
- **Developers**: Place KanbanTableRow within KanbanTableHead, KanbanTableBody, or KanbanTableFoot.

## Composition

KanbanTableRow is a child of KanbanTableHead/KanbanTableBody/KanbanTableFoot, following the Table pattern: KanbanTable > KanbanTableHead/KanbanTableBody/KanbanTableFoot > KanbanTableRow > KanbanTableData.

## References

- MDN tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
