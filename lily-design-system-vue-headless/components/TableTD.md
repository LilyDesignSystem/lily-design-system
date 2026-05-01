# TableTD

A data cell within a Table, rendered as a `<td>` element. Used inside a `<TableRow>` within `<TableBody>` or `<TableFoot>` to hold one cell of data.

## Props

- `colspan`: number (optional) -- number of columns this cell spans
- `rowspan`: number (optional) -- number of rows this cell spans
- default slot — cell content

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
      <TableTD>Alice</TableTD>
      <TableTD>alice@example.com</TableTD>
    </TableRow>
  </TableBody>
</Table>
```

## References

- HTML td element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td
