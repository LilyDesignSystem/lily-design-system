# TableTH

A header cell within a Table, rendered as a `<th>` element. Used inside a `<TableRow>` within `<TableHead>` to label columns, or with `scope="row"` to label a row.

## Props

- `className`: string (optional) -- CSS class name appended to `table-th`
- `colSpan`: number (optional) -- number of columns this header cell spans
- `rowSpan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: ReactNode (optional) -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>`

## Usage

```tsx
<Table label="Users">
  <TableHead>
    <TableRow>
      <TableTH>Name</TableTH>
      <TableTH>Email</TableTH>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableTH scope="row">Alice</TableTH>
      <TableTD>alice@example.com</TableTD>
    </TableRow>
  </TableBody>
</Table>
```

## References

- HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
