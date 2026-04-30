# RangeInput

## Metadata

- Component: range-input
- PascalCase: RangeInput
- Description: a slider input for selecting a value within a range <input type="range">
- HTML tag: <input>
- CSS class: .range-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="range">` element for native slider behavior
- Supports two-way binding for the `value` prop enabling two-way data binding with two-way `value` binding
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `class`)
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Default value is 50, centered in the default 0-100 range

## ARIA

- `aria-label={label}` -- provides the accessible name for the slider control since no visible label element is associated

## Keyboard

- Left Arrow / Down Arrow: decrease value by one step
- Right Arrow / Up Arrow: increase value by one step
- Home: set to minimum value
- End: set to maximum value
- Page Down: decrease by a larger step (browser-defined)
- Page Up: increase by a larger step (browser-defined)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: number (default: 50) -- current numeric value, bindable with two-way `value` binding
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 100) -- maximum allowed value
- `step`: number (default: 1) -- increment between selectable values
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="range-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .range-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/range-input.html
- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
