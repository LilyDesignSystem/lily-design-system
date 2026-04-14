# Table Data

TableData is a headless component that renders a `<td>` element within a table row. It represents a single data cell.

Use this component within TableRow to define individual data cells in a table.

## Implementation Notes

- Renders a `<td>` element for table data cell semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<td>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the cell
- `children`: slot (required) -- cell content
- `...restProps`: unknown -- additional attributes spread onto the `<td>` element

## Usage

```html
<TableRow>
  <TableData>Alice</TableData>
  <TableData>alice@example.com</TableData>
</TableRow>
```

## Keyboard Interactions

Standard table cell keyboard interactions.

## ARIA

No additional ARIA attributes. Cell semantics are provided by the `<td>` element.

## When to Use

- Use inside TableRow to represent one data cell containing values, text, or other content
- Use right-alignment for numeric data to aid comparison across rows
- Use to display individual pieces of data within a structured table

## When Not to Use

- Do not use for header cells -- use TableCol with an appropriate `scope` attribute
- Do not leave cells empty -- use "No data" or "Not applicable" with secondary text colour
- Do not use outside of a Table -- use DataTableData for DataTable or CalendarTableData for CalendarTable

## Headless

This headless component renders a `<td>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-data` class for targeting.

## Testing

- Verify the component renders a `<td>` element
- Verify children content is rendered
- Verify pass-through attributes are applied

## Composition

TableData is a child of TableRow, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableData.

## References

- MDN td element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td
