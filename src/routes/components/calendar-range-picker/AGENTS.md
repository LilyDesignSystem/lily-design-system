# CalendarRangePicker

## Metadata

- Component: calendar-range-picker
- PascalCase: CalendarRangePicker
- Description: a picker for selecting a date range on a calendar
- HTML tag: <div>
- CSS class: .calendar-range-picker
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="group"`, naming the controls the consumer puts inside it
- Consumer provides all calendar grid rendering, date selection logic, and range highlighting
- The `role="group"` leaves screen readers' reading keys working, so a calendar with no keys of its own stays readable; put `role="grid"` on the calendar itself if the consumer adds arrow keys
- Accepts `...restProps` for forwarding additional attributes to the container

## ARIA

- `role="group"` -- groups the calendar controls under `aria-label`, and does not take over screen reader navigation
- `aria-label={label}` -- provides an accessible name for the calendar range picker

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the picker purpose, applied via `aria-label`
- `children`: slot (required) -- the calendar grid content including date cells and navigation controls

## Acceptance Criteria

- [ ] Renders <div> element with class="calendar-range-picker"
- [ ] Has aria-label attribute
- [ ] Has role="group"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .calendar-range-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/calendar-range-picker.html
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
