# RedOrangeYellowGreenBluePicker

## Metadata

- Component: red-orange-yellow-green-blue-picker
- PascalCase: RedOrangeYellowGreenBluePicker
- Description: a picker for selecting a five-level color status
- HTML tag: <div>
- CSS class: .red-orange-yellow-green-blue-picker
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Children: red-orange-yellow-green-blue-picker-button

## Companion

- red-orange-yellow-green-blue-view

## Key Behaviors

- Renders as `<select aria-label={label}>` with five options: red, orange, yellow, green, blue
- The `value` prop is two-way binding
- Uses native select keyboard navigation

## ARIA

- `aria-label` on the select from the label prop

## Keyboard

- Arrow keys navigate options (native select behavior)
- Enter/Space opens the dropdown
- Escape closes the dropdown

## Props

- `label`: string (required) -- accessible label for the select
- `value`: string (default: "") -- currently selected status, bindable
- `...restProps`: Any additional HTML attributes spread onto the select

## Acceptance Criteria

- [ ] Renders <div> element with class="red-orange-yellow-green-blue-picker"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .red-orange-yellow-green-blue-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/red-orange-yellow-green-blue-picker.html
- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
