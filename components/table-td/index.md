# Table TD

TableTD is a headless component that renders a `<td>` element within a table row. It represents a single data cell.

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
  <TableTD>Alice</TableTD>
  <TableTD>alice@example.com</TableTD>
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

- Do not use for header cells -- use TableTD with an appropriate `scope` attribute
- Do not leave cells empty -- use "No data" or "Not applicable" with secondary text colour
- Do not use outside of a Table -- use DataTableTD for DataTable or CalendarTableTD for CalendarTable

## Headless

This headless component renders a `<td>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-td` class for targeting.

## Testing

- Verify the component renders a `<td>` element
- Verify children content is rendered
- Verify pass-through attributes are applied

## Composition

TableTD is a child of TableRow, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableTD.

## Related components

- `table` — a table with rows and columns <table>
- `table-body` — a table interactive grid tbody <tbody>
- `table-foot` — a table interactive grid tfoot <tfoot>
- `table-head` — a table interactive grid thead <thead>
- `table-row` — a table interactive grid row <tr>
- `table-th` — a table interactive grid column <th>

## References

- MDN td element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td

---

Lily™ and Lily Design System™ are trademarks.
