# CalendarTableRow

## Metadata

- Component: calendar-table-row
- PascalCase: CalendarTableRow
- Description: a calendar table interactive grid row for managing dates, days, etc. <tr>
- HTML tag: <tr>
- CSS class: .calendar-table-row
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: calendar-table

## Key Behaviors

- Renders as a `<tr>` element for one row in a calendar grid
- Children should be day cells (`<td>` or CalendarTableCell) or header cells (`<th>`)
- Designed to be used inside CalendarTableHead, CalendarTableBody, or CalendarTableFoot
- Spreads `restProps` onto the `<tr>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `row` role from the `<tr>` element -- identifies a row of cells within the grid

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- cells for this row, typically day numbers or day-of-week labels
- `...restProps`: Any additional HTML attributes passed to the `<tr>` element

## Acceptance Criteria

- [ ] Renders <tr> element with class="calendar-table-row"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .calendar-table-row in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/calendar-table-row.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
