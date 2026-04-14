# Kanban Table Col

KanbanTableCol is a headless component that renders a `<col>` element within a kanban board table column group. It applies column-level attributes and styling hooks for kanban status columns.

Use this component within a KanbanTable to define column properties such as width or class for individual status columns.

## Implementation Notes

- Renders a `<col>` element for column-level styling within a `<colgroup>`
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<col>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the column
- `...restProps`: unknown -- additional attributes spread onto the `<col>` element

## Usage

Column group defining three equal-width status columns:

```html
<KanbanTable label="Sprint board">
    <colgroup>
        <KanbanTableCol class="todo-column" />
        <KanbanTableCol class="in-progress-column" />
        <KanbanTableCol class="done-column" />
    </colgroup>
    <KanbanTableHead>
        ...
    </KanbanTableHead>
    <KanbanTableBody>
        ...
    </KanbanTableBody>
</KanbanTable>
```

## Keyboard Interactions

None. Column elements are not interactive.

## ARIA

No ARIA attributes. Column elements are structural, not semantic.

## When to Use

- Use inside KanbanTable to define column-level properties such as width or class.
- Use within a `<colgroup>` to apply consistent styling across status columns.
- Use to set uniform widths for workflow stage columns.

## When Not to Use

- Do not use outside of a KanbanTable context -- use TableCol or DataTableCol for general tables.
- Do not use for row-level content -- use KanbanTableRow and KanbanTableData instead.

## Headless

This headless component renders a `<col>` element. The consumer provides all visual styling including column widths and backgrounds.

## Styles

The consumer provides all CSS styling. The component renders with a `.kanban-table-col` class for targeting.

## Testing

- Verify the component renders a `<col>` element
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use column definitions to set consistent widths across status columns (e.g., To Do, In Progress, Done).
- **Developers**: Place KanbanTableCol elements inside a `<colgroup>` within KanbanTable.

## Composition

KanbanTableCol is a child of KanbanTable, following the Table pattern: KanbanTable > KanbanTableHead/KanbanTableBody/KanbanTableFoot > KanbanTableRow > KanbanTableData.

## References

- MDN col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
