# Table Foot

TableFoot is a headless component that renders a `<tfoot>` element within a table. It groups footer rows that provide summary or aggregate information.

Use this component within a Table to define the footer section, typically for totals or summary data.

## Implementation Notes

- Renders a `<tfoot>` element for table footer group semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<tfoot>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the footer group
- `children`: slot (required) -- footer rows, typically TableRow components
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>` element

## Usage

```html
<Table label="Budget">
  <TableFoot>
    <TableRow>
      <TableTD>Total</TableTD>
      <TableTD>$1,000</TableTD>
    </TableRow>
  </TableFoot>
</Table>
```

## Keyboard Interactions

Standard table keyboard interactions.

## ARIA

No additional ARIA attributes. Footer semantics are provided by the `<tfoot>` element.

## When to Use

- Use inside Table to wrap footer rows containing totals or summary information
- Use when a table needs aggregate data such as sums, averages, or counts at the bottom
- Use to provide a visually distinct footer section that screen readers can navigate to

## When Not to Use

- Do not use outside of a Table -- use DataTableFoot for DataTable or CalendarTableFoot for CalendarTable
- Do not use for column headings -- use TableHead instead

## Headless

This headless component renders a `<tfoot>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-foot` class for targeting.

## Testing

- Verify the component renders a `<tfoot>` element
- Verify children content is rendered
- Verify pass-through attributes are applied

## Composition

TableFoot is a child of Table, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableTD.

## Related components

- `table` — a table with rows and columns <table>
- `table-body` — a table interactive grid tbody <tbody>
- `table-head` — a table interactive grid thead <thead>
- `table-row` — a table interactive grid row <tr>
- `table-td` — a table interactive grid data cell <td>
- `table-th` — a table interactive grid column <th>

## References

- MDN tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

---

Lily™ and Lily Design System™ are trademarks.
