# CalendarTable

## Metadata

- Component: calendar-table
- PascalCase: CalendarTable
- Description: a calendar table interactive grid for managing dates, days, etc. <table>
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <table>
- CSS class: .calendar-table
- Interactive: yes

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Children: calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-th, calendar-table-row, calendar-table-td

## Key Behaviors

- Renders a `<table>` element with `role="grid"` for structured calendar grid semantics
- Consumer provides `<tr>` rows with `<td>` or `<th>` cells as children
- The `label` prop should describe the calendar period (e.g., "January 2025")
- Accepts `...restProps` for forwarding additional attributes to the table element
- No internal state -- purely a structural wrapper
- Owns the grid keys below, over the cells the consumer renders; a root inside `[data-consumer-keys]` attaches none, for a consumer running its own

## ARIA

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the calendar period

## Keyboard

- Tab: moves to the calendar, on its one tab stop, and out of it
- ArrowRight / ArrowLeft: next or previous cell in the row, swapped in right-to-left; stops at the edge
- ArrowDown / ArrowUp: next or previous row; stops at the edge
- Home / End: first or last cell in the row
- Ctrl+Home / Ctrl+End (Cmd on macOS): first or last cell in the calendar
- PageDown / PageUp: ten rows, stopping at the edge
- Enter or F2: go to the first control in the cell, which keeps its own keys
- Escape: from a control, back to its cell
- Selecting, sorting and editing are the consumer's. A consumer running its own grid keys, as the `calendar` helper does, sets `data-consumer-keys` on the root.

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
