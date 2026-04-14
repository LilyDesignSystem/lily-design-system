# Table Head

TableHead is a headless component that renders a `<thead>` element within a table. It groups header rows that define column labels.

Use this component within a Table to define the header section containing column headings.

## Implementation Notes

- Renders a `<thead>` element for table header group semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<thead>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the header group
- `children`: slot (required) -- header rows, typically TableRow components with `<th>` cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>` element

## Usage

```html
<Table label="Users">
  <TableHead>
    <TableRow>
      <th>Name</th>
      <th>Email</th>
    </TableRow>
  </TableHead>
</Table>
```

## Keyboard Interactions

Standard table keyboard interactions.

## ARIA

No additional ARIA attributes. Header semantics are provided by the `<thead>` element.

## When to Use

- Use inside Table to wrap the header row(s) that label each column
- Use to group `<th>` cells with `scope="col"` that define column headings
- Use to provide a visually distinct header section that screen readers can navigate to

## When Not to Use

- Do not use outside of a Table -- use DataTableHead for DataTable or CalendarTableHead for CalendarTable
- Do not use for footer summary rows -- use TableFoot instead

## Headless

This headless component renders a `<thead>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-head` class for targeting.

## Testing

- Verify the component renders a `<thead>` element
- Verify children content is rendered
- Verify pass-through attributes are applied

## Composition

TableHead is a child of Table, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableData.

## References

- MDN thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
