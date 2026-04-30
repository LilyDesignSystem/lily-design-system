# RedAmberGreenPicker

## Metadata

- Component: red-amber-green-picker
- PascalCase: RedAmberGreenPicker
- Description: a picker for selecting a red/amber/green status
- HTML tag: <div>
- CSS class: .red-amber-green-picker
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Children: red-amber-green-picker-button

## Companion

- red-amber-green-view

## Key Behaviors

- Renders as `<select aria-label={label}>` with three options: red, amber, green
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

- [ ] Renders <div> element with class="red-amber-green-picker"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .red-amber-green-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/red-amber-green-picker.html
- RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system
