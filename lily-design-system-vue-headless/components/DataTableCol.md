# DataTableTD

A column header cell within a DataTable, rendered as a `<th scope="col">` element. Intended to live inside a DataTableRow within DataTableHead, where it labels a column.

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default `"col"`)
- default slot -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>`

## Usage

```vue
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
