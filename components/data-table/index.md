# Data Table

A data table displays structured information in rows and columns, allowing users to scan, compare, and analyze data. It wraps content in a semantic `<table>` element with proper `<caption>` support for accessibility. Consumers provide their own `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements as children.

The component supports two labelling strategies: a visible `<caption>` element for sighted users and screen readers alike, or an `aria-label` for cases where the caption should not be displayed visually. When a `caption` prop is provided, `aria-label` is omitted to avoid redundancy.

## Implementation Notes

- Renders a semantic `<table>` element
- Conditionally renders a `<caption>` element when the `caption` prop is provided
- Uses `aria-label` only when no `caption` is present, to avoid duplicate accessible names
- Spreads `restProps` onto the `<table>` for consumer customization
- Consumers are responsible for `<thead>`, `<tbody>`, `scope` attributes on `<th>`, and all row/cell structure

## Props

- `caption`: string (default: undefined) -- visible caption text displayed above the table
- `label`: string (default: undefined) -- accessible label used when `caption` is not provided
- `children`: slot (required) -- table content including thead, tbody, tr, th, td elements

## Usage

A patient appointments table with sortable columns and status tags:

```html
<DataTable caption="Patient appointments" label="Upcoming appointments">
  <DataTableHead>
    <DataTableRow>
      <DataTableTD scope="col" sortable>Patient name</DataTableTD>
      <DataTableTD scope="col" sortable>Date</DataTableTD>
      <DataTableTD scope="col">Status</DataTableTD>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableTD>Karen Francis</DataTableTD>
      <DataTableTD>15 March 2025</DataTableTD>
      <DataTableTD><Tag variant="success">Confirmed</Tag></DataTableTD>
    </DataTableRow>
    <DataTableRow>
      <DataTableTD>James Lee</DataTableTD>
      <DataTableTD>22 March 2025</DataTableTD>
      <DataTableTD><Tag variant="warning">Pending</Tag></DataTableTD>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

## Keyboard Interactions

None -- this component is a passive container. Navigation within the table follows standard browser behavior.

## ARIA

- `aria-label={label}` -- provides an accessible name when no visible caption is present
- `<caption>` -- semantic table caption that serves as the accessible name when provided

## When to Use

- Use for interactive tabular data that supports sorting, filtering, or pagination.
- Use when users need to work with large datasets, such as patient lists, appointment schedules, or test results.
- Use when data has clear column headers and row relationships that benefit from a grid format.
- Use with DataFilterForm to provide client-side or AJAX-based filtering of the dataset.

## When Not to Use

- Do not use for simple static content -- use Table instead.
- Do not use for scheduling visualisation -- use GanttTable.
- Do not use for status boards -- use KanbanTable.
- Do not use for layout purposes -- use CSS grid or flexbox instead.

## Headless

This headless DataTable component provides a semantic `<table>` element with conditional `<caption>` or `aria-label` for accessible naming. The consumer provides all visual styling including borders, striping, hover highlights, column widths, responsive behavior, and sorting indicators.


## Styles

The consumer provides all CSS styling. The component renders with a `.data-table` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<table>` element with class `data-table`
- Verify aria-label={label}` -- provides an accessible name when no visible caption is present
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use alternating row colors or borders to improve scanability. Ensure column headers are visually distinct from data cells. Consider horizontal scrolling or responsive stacking for narrow viewports.
- **Developers**: Use the `caption` prop for visible table descriptions or `label` for screen-reader-only names. Always add `scope="col"` or `scope="row"` to `<th>` elements. Use DataTableHead, DataTableBody, DataTableFoot, DataTableRow, and DataTableTD for structured composition.

## Composition

DataTable follows the Table/Head/Body/Foot/Row/Data composition pattern. Use DataTable as the root `<table>`, DataTableHead for the `<thead>` with column headers, DataTableBody for the `<tbody>` with data rows, DataTableFoot for optional `<tfoot>` with summary rows, DataTableRow for each `<tr>`, and DataTableTD for each `<td>`. Optionally use DataTableTD inside a `<colgroup>` for column-level styling.

## Related components

- `data-table-body` — a data table interactive grid tbody for displaying and sorting tabular data <tbody>
- `data-table-foot` — a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>
- `data-table-head` — a data table interactive grid thead for displaying and sorting tabular data <thead>
- `data-table-row` — a data table interactive grid row for displaying and sorting tabular data <tr>
- `data-table-td` — a data table interactive grid data cell for displaying and sorting tabular data <td>
- `data-table-th` — a data table interactive grid header cell for displaying and sorting tabular data <th>
- `table` — a table with rows and columns <table>

## References

- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
