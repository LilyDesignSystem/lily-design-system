# DataTableRow

A single row within a DataTable. Renders as a `<tr>` containing DataTableData cells or header cells. Used inside DataTableHead, DataTableBody, or DataTableFoot.

## Props

- `children`: Snippet (required) -- DataTableData cells or header cells for this row
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```svelte
<DataTableBody>
  <DataTableRow>
    <DataTableData>Alice</DataTableData>
    <DataTableData>alice@example.com</DataTableData>
  </DataTableRow>
</DataTableBody>
```

## Accessibility

- `<tr>` has implicit `role="row"` (no explicit role attribute needed)

## References

- HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
