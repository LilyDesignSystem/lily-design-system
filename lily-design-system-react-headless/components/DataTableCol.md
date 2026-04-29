# DataTableTD

A column header cell within a DataTable, rendered as a `<th scope="col">` element. Intended to live inside a DataTableRow within DataTableHead, where it labels a column.

## Props

- `colSpan`: number (optional) -- number of columns this header cell spans
- `rowSpan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default `"col"`)
- `children`: optional -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>`

## Usage

```tsx
<DataTable label="Users">
  <DataTableHead>
    <DataTableRow>
      <DataTableTD>Name</DataTableTD>
      <DataTableTD>Email</DataTableTD>
    </DataTableRow>
  </DataTableHead>
  ...
</DataTable>
```

## References

- HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
