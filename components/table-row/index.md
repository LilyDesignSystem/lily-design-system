# Table Row

TableRow is a headless component that renders a `<tr>` element within a table. It represents a single row of cells.

Use this component within TableHead, TableBody, or TableFoot to define rows of table data.

## Implementation Notes

- Renders a `<tr>` element for table row semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<tr>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the row
- `children`: slot (required) -- row cells, typically `<th>` or TableData components
- `...restProps`: unknown -- additional attributes spread onto the `<tr>` element

## Usage

```html
<TableBody>
  <TableRow>
    <TableData>Alice</TableData>
    <TableData>alice@example.com</TableData>
  </TableRow>
</TableBody>
```

## Keyboard Interactions

Standard table row keyboard interactions.

## ARIA

No additional ARIA attributes. Row semantics are provided by the `<tr>` element.

## When to Use

- Use inside TableHead, TableBody, or TableFoot to represent one row of data
- Use to group TableCol (header) and TableData (data) cells into a logical row
- Use inside TableHead for column header rows and inside TableBody for data rows

## When Not to Use

- Do not use outside of a Table -- use DataTableRow for DataTable or CalendarTableRow for CalendarTable
- Do not use as a standalone element -- it must be a child of TableHead, TableBody, or TableFoot

## Headless

This headless component renders a `<tr>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-row` class for targeting.

## Testing

- Verify the component renders a `<tr>` element
- Verify children content is rendered
- Verify pass-through attributes are applied

## Composition

TableRow is a child of TableHead/TableBody/TableFoot, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableData.

## References

- MDN tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
