# RedAmberGreenPickerButton

## Metadata

- Component: red-amber-green-picker-button
- PascalCase: RedAmberGreenPickerButton
- Description: a picker button for selecting a red/amber/green status
- HTML tag: <button>
- CSS class: .red-amber-green-picker-button
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Parent: red-amber-green-picker

## Key Behaviors

- Renders as a `<button>` element with `aria-pressed` for toggle state
- Designed to be used inside a RedAmberGreenPicker component
- Each button represents one of three RAG status levels (red, amber, green)
- The `selected` prop controls `aria-pressed` to indicate the active selection
- The `data-value` attribute carries the status value for CSS targeting
- The `label` prop provides the accessible name via `aria-label`
- Spreads `...restProps` onto the `<button>` element for consumer customization

## ARIA

- `aria-pressed` -- indicates whether this button is the currently selected status (`true` when selected, `false` otherwise)
- `aria-label` -- provides the accessible name for the button (e.g., "Amber - Caution")
- `data-value` -- carries the status value for CSS-based styling (e.g., `data-value="red"`)

## Keyboard

- Tab: Focus the button
- Enter / Space: Activate the button to select this status

## Props

- `value`: string (required) -- the RAG status value this button represents (e.g., "red", "amber", "green")
- `selected`: boolean (default: false) -- whether this button is currently selected
- `label`: string (required) -- accessible label for the button (e.g., "Red - Critical", "Amber - Caution", "Green - On track")
- `onclick`: callback -- handler called when the button is clicked
- `...restProps`: any -- additional HTML attributes spread onto the `<button>` element

## Acceptance Criteria

- [ ] Renders <button> element with class="red-amber-green-picker-button"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .red-amber-green-picker-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/red-amber-green-picker-button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system
