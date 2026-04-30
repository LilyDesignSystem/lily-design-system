# DateRange

## Metadata

- Component: date-range
- PascalCase: DateRange
- Description: a display of a start and end date range
- HTML tag: <span>
- CSS class: .date-range
- Interactive: yes

## Key Behaviors

- Renders a `<fieldset>` to semantically group the paired date inputs
- Uses two native `<input type="date">` elements for built-in browser date selection
- Both `start` and `end` use two-way binding
- Each input has its own `aria-label` for individual identification
- Accepts `...restProps` for forwarding additional attributes to the fieldset

## ARIA

- `aria-label={label}` on `<fieldset>` -- provides an accessible group name for the date range pair
- `aria-label={startLabel}` on the start input -- identifies the start date field
- `aria-label={endLabel}` on the end input -- identifies the end date field

## Keyboard

- Tab: Move focus between the start and end date inputs
- Up Arrow / Down Arrow: Increment/decrement the focused date segment
- Left Arrow / Right Arrow: Move between date segments within an input

## Props

- `label`: string (required) -- accessible group label applied to the fieldset via `aria-label`
- `startLabel`: string (required) -- accessible label for the start date input
- `endLabel`: string (required) -- accessible label for the end date input
- `start`: string (default: "") -- start date value in YYYY-MM-DD format; bindable
- `end`: string (default: "") -- end date value in YYYY-MM-DD format; bindable

## Acceptance Criteria

- [ ] Renders <span> element with class="date-range"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .date-range in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/date-range.html
- MDN input type="date": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
- MDN fieldset element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset
