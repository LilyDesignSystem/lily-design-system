# DataTableData

A single data cell within a DataTableRow. Renders as a `<td>` with `role="gridcell"`. Supports an active state for indicating the currently focused or selected cell, communicated via `aria-selected`. Uses a roving tabindex pattern.

## Props

- `active`: boolean (default: false) -- whether this cell is active/selected
- `children`: Snippet (required) -- cell content
- `...restProps`: unknown -- additional attributes spread onto the `<td>`

## Usage

```svelte
<DataTableRow>
  <DataTableData>Alice</DataTableData>
  <DataTableData active>Bob</DataTableData>
</DataTableRow>
```

## Accessibility

- `role="gridcell"` -- identifies the cell as part of an interactive grid
- `aria-selected` -- set to `true` when active; omitted otherwise
- Roving tabindex: `tabindex="0"` when active, `"-1"` otherwise

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
