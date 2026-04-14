# Table

A table is a component used to display structured data in rows and columns, making it easy to compare and analyze information at a glance. Commonly used for reports, schedules, product lists, and dashboards, tables organize content into headers and cells to improve data readability and support efficient decision-making.

This headless table component renders a semantic `<table>` element with an accessible label. The consumer provides all table content (thead, tbody, tfoot, caption, colgroup, etc.) through the children slot, maintaining full control over table structure and styling.

## Implementation Notes

- Renders as a semantic `<table>` element with `aria-label` for accessible naming
- All content (thead, tbody, tfoot, caption, colgroup, etc.) is provided through the `children` slot
- Uses props for prop destructuring with rest props spread
- Consumers are responsible for proper `<th scope="col">` and `<th scope="row">` attributes
- Consumers may add `<caption>` for a visible table title
- No built-in sorting, filtering, or pagination; consumers implement these as needed

## Props

- `label`: string (required) -- accessible label for the table via `aria-label`
- `children`: slot (required) -- table content including thead, tbody, tfoot, etc.
- `...restProps`: any -- additional HTML attributes spread onto the `<table>` element

## Usage

```html
<Table label="Prescription charges">
  <TableHead>
    <TableRow>
      <TableCol scope="col">Item</TableCol>
      <TableCol scope="col">Current charge</TableCol>
      <TableCol scope="col">New charge</TableCol>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCol scope="row">3-month prepayment certificate</TableCol>
      <TableData>£31.25</TableData>
      <TableData>£32.05</TableData>
    </TableRow>
    <TableRow>
      <TableCol scope="row">12-month prepayment certificate</TableCol>
      <TableData>£111.60</TableData>
      <TableData>£114.50</TableData>
    </TableRow>
  </TableBody>
</Table>
```

## Keyboard Interactions

- None directly -- standard table navigation is handled by screen readers and browser built-in behavior

## ARIA

- `aria-label` -- provides the accessible name for the table so screen readers can announce its purpose
- Semantic `<table>` element -- conveys tabular data structure to assistive technologies
- Consumers should use `<th scope="col">` for column headers and `<th scope="row">` for row headers

## When to Use

- Use to display structured data that benefits from side-by-side comparison in rows and columns
- Use when users need to scan and locate specific information quickly, such as dosages, charges, or schedules
- Use with a `<caption>` to describe the table's purpose for screen reader users
- Use `scope="col"` and `scope="row"` on header cells to associate them with data cells

## When Not to Use

- Do not use for page layout -- use GrailLayout or CSS grid/flexbox
- Do not use for key-value summary pairs -- use SummaryList instead
- Do not use for interactive data with sorting, filtering, or pagination -- use DataTable instead
- Do not use for project scheduling -- use GanttTable for timeline-based data

## Headless

This headless component renders a semantic `<table>` element with `aria-label` for accessible naming. It provides the table structure and leaves all content (thead, tbody, tfoot, caption, colgroup) and visual styling to the consumer, including borders, striping, spacing, and responsive behavior.


## Styles

The consumer provides all CSS styling. The component renders with a `.table` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<table>` element with class `table`
- Verify aria-label` -- provides the accessible name for the table so screen readers can announce its purpose
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use alternating row colors or subtle borders to improve scannability. Ensure column headers are visually distinct from data cells.
- **Developers**: Always use `<th scope="col">` for column headers and `<th scope="row">` for row headers to ensure screen readers announce headers correctly. Add a `<caption>` element for a visible table title when appropriate.

## References

- WAI-ARIA Table Role: https://www.w3.org/WAI/ARIA/apd/patterns/table/
- HTML Table Element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
