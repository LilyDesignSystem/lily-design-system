# TableTD

A data cell within a Table, rendered as a `<td>` element. Used inside a `<TableRow>` within `<TableBody>` or `<TableFoot>` to hold one cell of data.

## Props

- `className`: string (optional) -- CSS class name appended to `table-td`
- `colSpan`: number (optional) -- number of columns this cell spans
- `rowSpan`: number (optional) -- number of rows this cell spans
- `children`: ReactNode (optional) -- cell content
- `...restProps`: unknown -- additional attributes spread onto the `<td>`

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
      <TableTD>Alice</TableTD>
      <TableTD>alice@example.com</TableTD>
    </TableRow>
  </TableBody>
</Table>
```

## References

- HTML td element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td
