# DataTableRow

A single row within a DataTable. Renders as a `<tr>` containing DataTableTD cells or header cells. Used inside DataTableHead, DataTableBody, or DataTableFoot.

## Props

- `children`: Snippet (required) -- DataTableTD cells or header cells for this row
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```svelte
<DataTableBody>
  <DataTableRow>
    <DataTableTD>Alice</DataTableTD>
    <DataTableTD>alice@example.com</DataTableTD>
  </DataTableRow>
</DataTableBody>
```

## Accessibility

- `<tr>` has implicit `role="row"` (no explicit role attribute needed)

## References

- HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
