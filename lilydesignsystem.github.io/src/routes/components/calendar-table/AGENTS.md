# CalendarTable

## Metadata

- Component: calendar-table
- PascalCase: CalendarTable
- Description: a calendar table interactive grid for managing dates, days, etc. <table>
- HTML tag: <table>
- CSS class: .calendar-table
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Children: calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-th, calendar-table-row, calendar-table-td

## Key Behaviors

- Renders a `<table>` element with `role="grid"` for structured calendar grid semantics
- Consumer provides `<tr>` rows with `<td>` or `<th>` cells as children
- The `label` prop should describe the calendar period (e.g., "January 2025")
- Accepts `...restProps` for forwarding additional attributes to the table element
- No internal state -- purely a structural wrapper

## ARIA

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the calendar period

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the calendar period (e.g., month and year), applied via `aria-label`
- `children`: slot (required) -- table rows and cells representing the calendar grid

## Acceptance Criteria

- [ ] Renders <table> element with class="calendar-table"
- [ ] Has aria-label attribute
- [ ] Has role="grid"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .calendar-table in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/calendar-table.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
