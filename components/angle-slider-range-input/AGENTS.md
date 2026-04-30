# AngleSliderRangeInput

## Metadata

- Component: angle-slider-range-input
- PascalCase: AngleSliderRangeInput
- Description: a range input for selecting an angle in degrees
- HTML tag: <input>
- CSS class: .angle-slider-range-input
- Interactive: yes

## Key Behaviors

- Built on native `<input type="range">` for inherent slider behavior
- Supports two-way binding for two-way value binding
- `aria-valuetext` provides human-readable angle text (e.g., "90") for screen readers
- Customizable suffix via `valueTextSuffix` prop (default "°", can be " degrees" etc.)
- derived value computes valueText reactively from value and suffix

## ARIA

- `role="slider"` (implicit from input[type="range"])
- `aria-label` from label prop
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-valuetext` for human-readable angle (e.g., "90°")

## Keyboard

- Arrow Right/Up: Increase value by step
- Arrow Left/Down: Decrease value by step
- Home: Set to minimum
- End: Set to maximum
- (All handled natively by input[type="range"])

## Props

- `value`: number (default: 0, bindable) -- current angle in degrees
- `min`: number (default: 0) -- minimum angle
- `max`: number (default: 360) -- maximum angle
- `step`: number (default: 1) -- step increment
- `label`: string (required) -- accessible label
- `disabled`: boolean (default: false)
- `name`: string (optional) -- form field name
- `id`: string (optional) -- element ID
- `valueTextSuffix`: string (default: "°") -- suffix for aria-valuetext
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <input> element with class="angle-slider-range-input"
- [ ] Has aria-label attribute
- [ ] Has role="slider"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .angle-slider-range-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/angle-slider-range-input.html
- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
