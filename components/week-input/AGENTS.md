# WeekInput

## Metadata

- Component: week-input
- PascalCase: WeekInput
- Description: an input for selecting a week and year <input type="week">
- HTML tag: <input>
- CSS class: .week-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="week">` element for native week picker behavior
- Supports two-way binding for the `value` prop enabling two-way data binding with two-way `value` binding
- Values follow the ISO 8601 week format: YYYY-Www (e.g., "2024-W01" for the first week of 2024)
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `min`, `max`, `class`)
- Browser support varies; some browsers render a native week picker while others fall back to a text input

## ARIA

- `aria-label={label}` -- provides the accessible name for the week input since no visible label element is associated

## Keyboard

- Up Arrow / Down Arrow: adjust the focused segment (year or week number)
- Left Arrow / Right Arrow: move focus between year and week segments
- Enter: confirm selection / submit form

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current week value in YYYY-Www format, bindable with two-way `value` binding
- `required`: boolean (default: false) -- whether the field must be filled before form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="week-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .week-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/week-input.html
- MDN input type="week": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week
