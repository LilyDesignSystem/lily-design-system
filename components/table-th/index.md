# Table TH

TableTD is a headless component that renders a `<th scope="col">` element — a column header cell — intended to live inside a TableRow within TableHead.

Use this component to label the columns of a table.

## Implementation Notes

- Renders a `<th>` element with `scope="col"` by default
- Accepts `className` for CSS class targeting
- Accepts optional `colspan` / `rowspan` for grouped header cells
- Accepts an alternative `scope` (e.g. `"colgroup"` for grouped headers)
- Renders header text via children
- Spreads `restProps` onto the `<th>` element

## Props

- `className`: string (default: `""`) -- CSS class appended to the base `table-th` class
- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: optional -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>` element

## Usage

```html
<Table label="Users">
  <TableHead>
    <TableRow>
      <TableTD>Name</TableTD>
      <TableTD>Email</TableTD>
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

## Keyboard Interactions

None. Header cells are not interactive.

## ARIA

`scope="col"` associates the header with its column for assistive technologies. Use `scope="colgroup"` together with `colspan` for grouped column headers.

## When to Use

- For column header cells in the header row of a table
- For grouped header cells via `colspan` / `rowspan`

## When Not to Use

- Do not use for data cells -- use TableTD for `<td>` elements
- Do not use for column-wide styling hooks via `<colgroup>` / `<col>` -- write those directly inside Table
- Do not use outside of a Table -- use DataTableTD for DataTable, CalendarTableTD for CalendarTable, etc.

## Headless

This headless component renders a `<th>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-th` class for targeting.

## Testing

- Verify the component renders a `<th>` element
- Verify `scope="col"` is the default
- Verify `colspan` / `rowspan` are applied when set
- Verify pass-through attributes are applied

## Composition

TableTD is a child of TableRow within TableHead, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableTD/TableTD.

## References

- MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
