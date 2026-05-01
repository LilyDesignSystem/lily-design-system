# TableTH

A header cell within a Table, rendered as a `<th>` element. Used inside a `<TableRow>` within `<TableHead>` to label columns, or with `scope="row"` to label a row.

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- default slot — header cell content

## Usage

```vue
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
