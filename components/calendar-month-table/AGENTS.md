# CalendarMonthTable

## Metadata

- Component: calendar-month-table
- PascalCase: CalendarMonthTable
- Description: a calendar grid showing the days of one month: week rows by seven day columns
- Status: beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows
- HTML tag: <table>
- CSS class: .calendar-month-table
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Row/Data (reuses the calendar-table sub-elements)
- Children: calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-th, calendar-table-row, calendar-table-td

## Key Behaviors

- Renders a `<table>` with `role="grid"` and `data-view="month"`
- Consumer provides head, body and rows; the consumer owns locale formatting and cell content
- Optional `caption` renders a visible `<caption>`
- Accepts `...restProps` for forwarding additional attributes to the table element
- No internal state -- purely a structural wrapper

## ARIA

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the period

## Keyboard

- No keyboard interactions built in — the consumer implements grid navigation

## Props

- `class`: string (default: `""`) -- appended to the base class
- `label`: string (required) -- accessible name describing the period shown, applied via `aria-label`
- `caption`: string (optional) -- visible caption
- `children`: slot (required) -- table sections and rows
- `...restProps`: HTML attributes -- spread onto the root `<table>`

## Acceptance Criteria

- [ ] Renders <table> element with class="calendar-month-table"
- [ ] Has aria-label attribute
- [ ] Has role="grid" and data-view="month"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .calendar-month-table in css-style-sheet-template.css
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
