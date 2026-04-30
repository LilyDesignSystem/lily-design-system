# NetPromoterScorePickerButton

## Metadata

- Component: net-promoter-score-picker-button
- PascalCase: NetPromoterScorePickerButton
- Description: a picker button for selecting a 0-10 Net Promoter Score
- HTML tag: <button>
- CSS class: .net-promoter-score-picker-button
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Parent: net-promoter-score-picker

## Key Behaviors

- Renders as a `<button>` element with `aria-pressed` for toggle state
- Designed to be used inside a NetPromoterScorePicker component
- Each button represents one score value from 0 to 10
- The `selected` prop controls `aria-pressed` to indicate the active selection
- The `label` prop provides the accessible name via `aria-label`
- Spreads `...restProps` onto the `<button>` element for consumer customization

## ARIA

- `aria-pressed` -- indicates whether this button is the currently selected score (`true` when selected, `false` otherwise)
- `aria-label` -- provides the accessible name for the button (e.g., "8")

## Keyboard

- Tab: Focus the button
- Enter / Space: Activate the button to select this score

## Props

- `value`: string (required) -- the NPS score value this button represents (e.g., "0" through "10")
- `selected`: boolean (default: false) -- whether this button is currently selected
- `label`: string (required) -- accessible label for the button (e.g., "0 - Not at all likely", "10 - Extremely likely")
- `onclick`: callback -- handler called when the button is clicked
- `...restProps`: any -- additional HTML attributes spread onto the `<button>` element

## Acceptance Criteria

- [ ] Renders <button> element with class="net-promoter-score-picker-button"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .net-promoter-score-picker-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/net-promoter-score-picker-button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
