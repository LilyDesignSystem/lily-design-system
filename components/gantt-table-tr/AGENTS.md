# Gantt Table Row

## Metadata

- Component: gantt-table-tr
- PascalCase: GanttTableTr
- Description: a Gantt chart table interactive grid row for planning schedule visualization <tr>
- HTML tag: <tr>
- CSS class: .gantt-table-tr
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: gantt-table

## Key Behaviors

- Renders as a `<tr>` element for one row in a Gantt chart grid
- Children should be a task-name header cell (`<th>`) followed by time-period data cells (`<td>` or GanttTableTD)
- Designed to be used inside GanttTableHead, GanttTableBody, or GanttTableTfoot
- Spreads `restProps` onto the `<tr>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `row` role from the `<tr>` element -- identifies a row of cells within the grid

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- cells for this row, typically a task name and time-period indicators
- `...restProps`: Any additional HTML attributes passed to the `<tr>` element

## Acceptance Criteria

- [ ] Renders <tr> element with class="gantt-table-tr"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .gantt-table-tr in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table-tr.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
