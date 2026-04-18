# KanbanTableData

A Kanban table data cell is a single cell within a KanbanTableRow, rendered as a `<td>` with `role="gridcell"`. Represents a task card or content area within a workflow column. Supports an active state with `aria-selected` and roving tabindex for keyboard navigation.

## Props

- `active`: boolean (optional, default false) -- marks the cell as currently active/selected
- `label`: string (optional) -- accessible name for the cell via `aria-label`
- `children`: Snippet (optional) -- cell content such as task cards or text
- `...restProps`: unknown -- additional attributes spread onto the `<td>`

## Usage

```svelte
<KanbanTableRow>
  <KanbanTableData active label="Fix login bug">Fix login bug</KanbanTableData>
  <KanbanTableData />
  <KanbanTableData />
</KanbanTableRow>
```

## Accessibility

- `role="gridcell"` -- identifies the cell as part of a grid
- `aria-selected` -- indicates the active/selected state when active is true
- `tabindex` -- roving tabindex (0 when active, -1 otherwise)
- `aria-label` -- optional accessible name for the cell

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
