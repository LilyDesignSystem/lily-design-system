# ColorInput

## Metadata

- Component: color-input
- PascalCase: ColorInput
- Description: an input for selecting a color value <input type="color">
- HTML tag: <input>
- CSS class: .color-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="color">` element for browser-native color picking
- Supports two-way binding of the hex color string
- Provides `aria-label` for screen reader accessibility since native color inputs have no visible label
- Supports `disabled`, `name`, and `id` for form integration
- Spreads `restProps` for consumer customization

## ARIA

- `aria-label="..."` -- provides an accessible name for the color input since it has no visible `<label>` element

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: string (default: `"#000000"`) -- current hex color string, two-way bindable via `value`
- `label`: string (required) -- accessible name via `aria-label`
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `name`: string (default: `undefined`) -- form field name
- `id`: string (default: `undefined`) -- element ID
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders <input> element with class="color-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .color-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/color-input.html
- MDN `<input type="color">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color
