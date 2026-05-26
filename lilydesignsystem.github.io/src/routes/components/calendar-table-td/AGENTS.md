# CalendarTableTD

## Metadata

- Component: calendar-table-td
- PascalCase: CalendarTableTD
- Description: a calendar table interactive grid data cell for managing dates, days, etc. <td>
- HTML tag: <td>
- CSS class: .calendar-table-td
- Interactive: yes

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: calendar-table

## Key Behaviors

- Renders as a `<td>` element with `role="gridcell"` for a single day cell in a calendar grid
- Supports `selected` and `today` states for visual and accessible indication
- Uses roving tabindex pattern: `tabindex="0"` when selected, `-1` otherwise
- `aria-selected` and `aria-current` are set conditionally (omitted when falsy via `|| undefined`)
- Content is provided through the children slot (typically the day number)
- Designed to be used inside a CalendarTable `<table>` / `<tr>` structure

## ARIA

- `role="gridcell"` -- identifies the cell as part of a grid
- `aria-selected` -- set to `true` when the cell is selected; omitted otherwise
- `aria-current="date"` -- set when the cell represents today's date; omitted otherwise

## Keyboard

- Tab: Focus moves to the selected cell (`tabindex="0"`)
- Arrow keys: Typically handled by the parent CalendarTable grid navigation

## Props

- `selected`: boolean (default: false) -- whether this day cell is selected
- `today`: boolean (default: false) -- whether this day cell represents today's date
- `children`: slot (required) -- day content, typically the day number
- `...restProps`: Any additional HTML attributes passed to the `<td>` element

## Acceptance Criteria

- [ ] Renders <td> element with class="calendar-table-td"
- [ ] Has role="gridcell"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .calendar-table-td in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/calendar-table-td.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
