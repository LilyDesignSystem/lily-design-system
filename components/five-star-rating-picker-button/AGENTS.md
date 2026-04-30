# FiveStarRatingPickerButton

## Metadata

- Component: five-star-rating-picker-button
- PascalCase: FiveStarRatingPickerButton
- Description: a picker button for selecting a 1-5 star rating using radio buttons
- HTML tag: <button>
- CSS class: .five-star-rating-picker-button
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Parent: five-star-rating-picker

## Key Behaviors

- Renders as a `<button>` element with `aria-pressed` for toggle state
- Designed to be used inside a FiveStarRatingPicker component
- Each button represents one of five star levels (1-5)
- The `selected` prop controls `aria-pressed` to indicate the active selection
- The `label` prop provides the accessible name via `aria-label` (e.g., "1 star", "3 stars")
- Spreads `...restProps` onto the `<button>` element for consumer customization

## ARIA

- `aria-pressed` -- indicates whether this button is the currently selected rating (`true` when selected, `false` otherwise)
- `aria-label` -- provides the accessible name for the button (e.g., "3 stars")

## Keyboard

- Tab: Focus the button
- Enter / Space: Activate the button to select this rating

## Props

- `value`: string (required) -- the star rating value this button represents (e.g., "1", "2", "3", "4", "5")
- `selected`: boolean (default: false) -- whether this button is currently selected
- `label`: string (required) -- accessible label for the button (e.g., "1 star", "2 stars", "5 stars")
- `onclick`: callback -- handler called when the button is clicked
- `...restProps`: any -- additional HTML attributes spread onto the `<button>` element

## Acceptance Criteria

- [ ] Renders <button> element with class="five-star-rating-picker-button"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .five-star-rating-picker-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/five-star-rating-picker-button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
