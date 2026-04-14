# Gantt Table Foot

A Gantt table foot is the footer section of a Gantt chart grid, wrapping one or more rows that provide summary information such as milestone markers, totals, or project-level notes. It is designed to be used inside a GanttTable `<table>` structure.

The component renders a `<tfoot>` element and passes through its children, which are expected to be GanttTableRow or `<tr>` elements.

## Implementation Notes

- Renders as a `<tfoot>` element for the footer section of a Gantt chart grid
- Children should be one or more rows providing summary, milestone, or aggregate information
- Designed to be used inside a GanttTable `<table>` structure
- Spreads `restProps` onto the `<tfoot>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- footer rows with summary or milestone content
- `...restProps`: Any additional HTML attributes passed to the `<tfoot>` element

## Usage

```html
<GanttTable label="Q1 2025 schedule">
  <GanttTableHead>...</GanttTableHead>
  <GanttTableBody>...</GanttTableBody>
  <GanttTableFoot>
    <GanttTableRow>
      <GanttTableCol scope="row">Milestone</GanttTableCol>
      <GanttTableData></GanttTableData>
      <GanttTableData></GanttTableData>
      <GanttTableData>Launch</GanttTableData>
    </GanttTableRow>
  </GanttTableFoot>
</GanttTable>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by the parent GanttTable grid.

## ARIA

- Implicit `rowgroup` role from the `<tfoot>` element -- groups the footer rows of the grid

## When to Use

- Use inside GanttTable to provide the `<tfoot>` footer section.
- Use to display milestone summaries, totals, or project-level notes beneath the task rows.
- Use when the Gantt chart needs aggregate information such as delivery dates or completion percentages.

## When Not to Use

- Do not use outside of a GanttTable structure -- use TableFoot or DataTableFoot for general tables.
- Do not use for header rows -- use GanttTableHead instead.
- Do not use when the Gantt chart has no summary data; the footer section is optional.

## Headless

This headless component provides a `<tfoot>` element with implicit `rowgroup` role for grouping footer rows within a Gantt chart grid. The consumer provides all visual styling including borders, background colors, and summary formatting.


## Styles

The consumer provides all CSS styling. The component renders with a `.gantt-table-foot` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tfoot>` element with class `gantt-table-foot`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Visually distinguish the footer from the body rows using a heavier border or different background color. Use the footer for milestone dates or completion summaries.
- **Developers**: Place GanttTableRow elements as children containing summary cells. The footer renders at the bottom of the table regardless of source order.

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
