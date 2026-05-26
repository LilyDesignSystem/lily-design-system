# RedOrangeYellowGreenBluePickerButton

## Metadata

- Component: red-orange-yellow-green-blue-picker-button
- PascalCase: RedOrangeYellowGreenBluePickerButton
- Description: a picker button for selecting a five-level color status
- HTML tag: <button>
- CSS class: .red-orange-yellow-green-blue-picker-button
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Parent: red-orange-yellow-green-blue-picker

## Key Behaviors

- Renders as a `<button>` element with `aria-pressed` for toggle state
- Designed to be used inside a RedOrangeYellowGreenBluePicker component
- Each button represents one of five status levels (red, orange, yellow, green, blue)
- The `selected` prop controls `aria-pressed` to indicate the active selection
- The `data-value` attribute carries the status value for CSS targeting
- The `label` prop provides the accessible name via `aria-label`
- Spreads `...restProps` onto the `<button>` element for consumer customization

## ARIA

- `aria-pressed` -- indicates whether this button is the currently selected status (`true` when selected, `false` otherwise)
- `aria-label` -- provides the accessible name for the button (e.g., "Yellow - Caution")
- `data-value` -- carries the status value for CSS-based styling (e.g., `data-value="yellow"`)

## Keyboard

- Tab: Focus the button
- Enter / Space: Activate the button to select this status

## Props

- `value`: string (required) -- the status value this button represents (e.g., "red", "orange", "yellow", "green", "blue")
- `selected`: boolean (default: false) -- whether this button is currently selected
- `label`: string (required) -- accessible label for the button (e.g., "Red - Critical", "Green - Good")
- `onclick`: callback -- handler called when the button is clicked
- `...restProps`: any -- additional HTML attributes spread onto the `<button>` element

## Acceptance Criteria

- [ ] Renders <button> element with class="red-orange-yellow-green-blue-picker-button"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .red-orange-yellow-green-blue-picker-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/red-orange-yellow-green-blue-picker-button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
