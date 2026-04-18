# DataTable

An interactive data table that displays structured information in rows and columns as a grid widget. Renders a `<table>` element with `role="grid"` and an accessible label. Supports an optional visible caption. Commonly used for sortable tables, editable spreadsheets, and interactive data grids.

Compound component: use with DataTableHead, DataTableBody, DataTableFoot, DataTableRow, DataTableData, and DataTableCol.

## Props

- `label`: string (required) -- accessible name describing the table content, applied via `aria-label`
- `caption`: string (optional) -- visible caption text displayed above the table
- `children`: Snippet (required) -- DataTableHead, DataTableBody, DataTableFoot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```svelte
<DataTable label="User accounts">
  <DataTableHead>
    <DataTableRow><th scope="col">Name</th><th scope="col">Email</th></DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableData>Alice</DataTableData>
      <DataTableData>alice@example.com</DataTableData>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

## Accessibility

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the table content
- `<caption>` -- visible accessible name when the caption prop is set

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
