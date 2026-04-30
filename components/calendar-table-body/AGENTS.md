# CalendarTableBody

## Metadata

- Component: calendar-table-body
- PascalCase: CalendarTableBody
- Description: a calendar table interactive grid tbody for managing dates, days, etc. <tbody>
- HTML tag: <tbody>
- CSS class: .calendar-table-body
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: calendar-table

## Key Behaviors

- Renders as a `<tbody>` element for the body section of a calendar grid
- Children should be rows of day cells, typically one row per week
- Designed to be used inside a CalendarTable `<table>` structure
- Spreads `restProps` onto the `<tbody>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `rowgroup` role from the `<tbody>` element -- groups the body rows of the grid

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- rows of day cells representing weeks in the calendar
- `...restProps`: Any additional HTML attributes passed to the `<tbody>` element

## Acceptance Criteria

- [ ] Renders <tbody> element with class="calendar-table-body"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .calendar-table-body in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/calendar-table-body.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
