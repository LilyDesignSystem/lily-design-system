# Gantt Table TD

A Gantt table data cell represents a single time period cell within a task row of a Gantt chart. It renders as a `<td>` element and is designed to be placed inside a GanttTableTR within a GanttTableBody. Each cell corresponds to one time period (e.g., a day, week, or sprint) for a particular task, and the consumer provides the cell content, such as a bar segment, milestone marker, or empty space.

## Implementation Notes

- Renders as a `<td>` element for use inside a GanttTableTR within a GanttTable grid
- Content is provided through the children slot, typically bar segments, milestone markers, or progress indicators
- Spreads `...restProps` onto the `<td>` element for consumer customization
- No internal state -- purely a structural wrapper for cell content

## Props

- `children`: slot (required) -- cell content such as bar segments, milestone markers, or text
- `...restProps`: any -- additional HTML attributes spread onto the `<td>` element

## Usage

```html
<GanttTableBody>
  <GanttTableTR>
    <GanttTableTH scope="row">Design phase</GanttTableTH>
    <GanttTableTD active aria-label="Design phase: Jan, in progress">████</GanttTableTD>
    <GanttTableTD active aria-label="Design phase: Feb, in progress">████</GanttTableTD>
    <GanttTableTD aria-label="Design phase: Mar, not scheduled"></GanttTableTD>
  </GanttTableTR>
  <GanttTableTR>
    <GanttTableTH scope="row">Development</GanttTableTH>
    <GanttTableTD aria-label="Development: Jan, not scheduled"></GanttTableTD>
    <GanttTableTD active aria-label="Development: Feb, in progress">████</GanttTableTD>
    <GanttTableTD active aria-label="Development: Mar, in progress">████</GanttTableTD>
  </GanttTableTR>
</GanttTableBody>
```

## Keyboard Interactions

None built-in -- the consumer should implement grid keyboard navigation on cells as needed (arrow keys for cell-to-cell movement within the grid).

## ARIA

- Implicit `gridcell` role from the `<td>` element when inside a `role="grid"` table
- Consumer may add `aria-label` or `aria-describedby` for cells with visual-only content (e.g., bar segments)

## When to Use

- Use inside GanttTable to provide the `<td>` data cell for a time period.
- Use inside a GanttTableTR to represent a single time period cell containing a bar segment, milestone marker, or empty space.
- Use to render visual bar segments, progress indicators, or milestone markers within the Gantt chart grid.

## When Not to Use

- Do not use outside of a GanttTable structure -- use TableTD or DataTableTD for general tables.
- Do not use for header cells -- use GanttTableTH instead.

## Headless

This headless component provides a `<td>` element with implicit `gridcell` role when inside a `role="grid"` table. The consumer provides all visual styling including bar rendering, milestone markers, progress indicators, and background colors.


## Styles

The consumer provides all CSS styling. The component renders with a `.gantt-table-td` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<td>` element with class `gantt-table-td`
- Verify Implicit `gridcell` role from the `<td>` element when inside a `role="grid"` table
- Verify Consumer may add `aria-label` or `aria-describedby` for cells with visual-only content (e.g., bar segments)
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use color-coded bar segments to represent task progress. Add milestone markers (e.g., diamonds) for key dates.
- **Developers**: Add `aria-label` to cells with visual-only content (e.g., bar segments) so screen readers can announce the cell meaning.

## Related components

- `gantt-table` — a Gantt chart table interactive grid for planning schedule visualization <table>
- `gantt-table-tbody` — a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>
- `gantt-table-tfoot` — a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>
- `gantt-table-thead` — a Gantt chart table interactive grid thead for planning schedule visualization <thead>
- `gantt-table-tr` — a Gantt chart table interactive grid row for planning schedule visualization <tr>
- `gantt-table-th` — a Gantt chart table interactive grid header cell for planning schedule visualization <th>
- `table` — a table with rows and columns <table>

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- WAI-ARIA gridcell role: https://www.w3.org/TR/wai-aria-1.2/#gridcell

---

Lily™ and Lily Design System™ are trademarks.
