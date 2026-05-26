# FiveFaceRatingPickerButton

## Metadata

- Component: five-face-rating-picker-button
- PascalCase: FiveFaceRatingPickerButton
- Description: a picker button for selecting a 1-5 satisfaction rating using face labels
- HTML tag: <button>
- CSS class: .five-face-rating-picker-button
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Parent: five-face-rating-picker

## Key Behaviors

- Renders as a `<button>` element with `aria-pressed` for toggle state
- Designed to be used inside a FiveFaceRatingPicker component
- Each button represents one of five satisfaction levels (1-5)
- The `selected` prop controls `aria-pressed` to indicate the active selection
- The `label` prop provides both the visible text and the accessible name via `aria-label`
- Spreads `...restProps` onto the `<button>` element for consumer customization

## ARIA

- `aria-pressed` -- indicates whether this button is the currently selected rating (`true` when selected, `false` otherwise)
- `aria-label` -- provides the accessible name for the button (e.g., "Very good")

## Keyboard

- Tab: Focus the button
- Enter / Space: Activate the button to select this rating

## Props

- `value`: string (required) -- the rating value this button represents (e.g., "1", "2", "3", "4", "5")
- `selected`: boolean (default: false) -- whether this button is currently selected
- `label`: string (required) -- accessible label for the button (e.g., "Very bad", "Bad", "Okay", "Good", "Very good")
- `onclick`: callback -- handler called when the button is clicked
- `...restProps`: any -- additional HTML attributes spread onto the `<button>` element

## Acceptance Criteria

- [ ] Renders <button> element with class="five-face-rating-picker-button"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .five-face-rating-picker-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/five-face-rating-picker-button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
