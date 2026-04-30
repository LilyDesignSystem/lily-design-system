# ColorPickerButton

## Metadata

- Component: color-picker-button
- PascalCase: ColorPickerButton
- Description: a button showing a color swatch in a color picker
- HTML tag: <button>
- CSS class: .color-picker-button
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Parent: color-picker

## Key Behaviors

- Renders a `<button>` element with `type="button"` to prevent form submission
- Uses inline `style:background-color` to display the color visually
- Exposes `data-color` attribute for consumer CSS selectors (e.g., styling based on selected color)
- Uses `aria-pressed` to communicate toggle/selected state to assistive technology
- Supports `disabled` state for unavailable color options
- Spreads `restProps` for consumer customization

## ARIA

- `aria-label={label}` -- provides an accessible name for the swatch since it has no visible text content
- `aria-pressed={selected}` -- indicates whether the swatch is currently selected in a toggle context

## Keyboard

- **Tab**: Moves focus to the swatch button
- **Enter / Space**: Activates the button (native button behavior)

## Props

- `color`: string (required) -- CSS color value applied as background-color and exposed via `data-color`
- `label`: string (required) -- accessible name announced by screen readers (e.g., "Red", "Ocean Blue")
- `selected`: boolean (default: `false`) -- whether the swatch is currently selected, reflected in `aria-pressed`
- `disabled`: boolean (default: `false`) -- whether the swatch is disabled
- `onclick`: `(event: MouseEvent) => void` (default: `undefined`) -- click handler for selection
- `...restProps`: any additional HTML attributes spread onto the button

## Acceptance Criteria

- [ ] Renders <button> element with class="color-picker-button"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .color-picker-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/color-picker-button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
