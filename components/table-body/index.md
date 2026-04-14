# Table Body

TableBody is a headless component that renders a `<tbody>` element within a table. It groups the main data rows of the table.

Use this component within a Table to define the body section containing data rows.

## Implementation Notes

- Renders a `<tbody>` element for table body group semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<tbody>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the body group
- `children`: slot (required) -- data rows, typically TableRow components
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>` element

## Usage

```html
<Table label="Users">
  <TableBody>
    <TableRow>
      <TableData>Alice</TableData>
      <TableData>alice@example.com</TableData>
    </TableRow>
  </TableBody>
</Table>
```

## Keyboard Interactions

Standard table keyboard interactions.

## ARIA

No additional ARIA attributes. Body semantics are provided by the `<tbody>` element.

## When to Use

- Use inside Table to wrap the data rows that contain the main table content
- Use to separate data rows from header rows (TableHead) and footer rows (TableFoot)
- Use to enable screen readers to distinguish between header and data sections

## When Not to Use

- Do not use outside of a Table -- use DataTableBody for DataTable or CalendarTableBody for CalendarTable
- Do not use for header rows -- use TableHead instead

## Headless

This headless component renders a `<tbody>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-body` class for targeting.

## Testing

- Verify the component renders a `<tbody>` element
- Verify children content is rendered
- Verify pass-through attributes are applied

## Composition

TableBody is a child of Table, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableData.

## References

- MDN tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
