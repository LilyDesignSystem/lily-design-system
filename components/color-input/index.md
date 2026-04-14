# Color Input

A color input wraps the native HTML `<input type="color">` element, providing a browser-native color picker with accessible labeling. The value is always a hex color string (e.g., "#ff0000"). This component is useful in settings panels, theme editors, or any interface where users need to select a color.

## Implementation Notes

- Renders a native `<input type="color">` element for browser-native color picking
- Supports two-way binding of the hex color string
- Provides `aria-label` for screen reader accessibility since native color inputs have no visible label
- Supports `disabled`, `name`, and `id` for form integration
- Spreads `restProps` for consumer customization

## Props

- `value`: string (default: `"#000000"`) -- current hex color string, two-way bindable via `value`
- `label`: string (required) -- accessible name via `aria-label`
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `name`: string (default: `undefined`) -- form field name
- `id`: string (default: `undefined`) -- element ID
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Usage

```html
<ColorInput label="Background color" value={color} />
```

## Keyboard Interactions

None -- keyboard behavior is provided by the browser-native color input.

## ARIA

- `aria-label="..."` -- provides an accessible name for the color input since it has no visible `<label>` element

## When to Use

- Use when users need to select a colour value using the native browser colour picker.
- Use for theme customisation, settings panels, or design tool configuration.
- Use for simple hex colour selection where a full custom picker is unnecessary.

## When Not to Use

- Do not use when you need a custom colour palette -- use ColorPicker for a two-dimensional saturation and brightness board.
- Do not use for preset colour choices -- use RadioGroup or SegmentGroup with colour swatches, or a group of ColorPickerButton components.

## Headless

This headless ColorInput component provides a native `<input type="color">` with `aria-label` for accessible naming, two-way binding on the hex value, and support for `disabled` and form attributes. The consumer provides all visual styling including the swatch display size, border treatment, and any surrounding label or helper text layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.color-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `color-input`
- Verify aria-label="..."` -- provides an accessible name for the color input since it has no visible `<label>` element
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the color swatch is large enough to be easily identifiable and clickable. Consider showing the hex value alongside the swatch for precision.
- **Developers**: The value is always a 7-character hex string (e.g., "#ff0000"). Use the native color picker for broad browser support, and pair with a visible label element when needed.

## References

- MDN `<input type="color">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color
