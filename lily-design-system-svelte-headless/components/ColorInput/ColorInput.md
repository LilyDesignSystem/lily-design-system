# ColorInput

A color input wraps the native HTML `<input type="color">` element, providing a browser-native color picker with accessible labeling. The value is always a hex color string (e.g., "#ff0000"). This component is useful in settings panels, theme editors, or any interface where users need to select a color.

## Implementation Notes

- Renders a native `<input type="color">` element for browser-native color picking
- Uses `bind:value` with `$bindable()` for two-way binding of the hex color string
- Provides `aria-label` for screen reader accessibility since native color inputs have no visible label
- Supports `disabled`, `name`, and `id` for form integration
- Spreads `restProps` for consumer customization

## Props

- `value`: string (default: `"#000000"`) -- current hex color string, bindable via `bind:value`
- `label`: string (required) -- accessible name via `aria-label`
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `name`: string (default: `undefined`) -- form field name
- `id`: string (default: `undefined`) -- element ID
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Usage

```svelte
<ColorInput label="Background color" bind:value={color} />
```

## Keyboard Interactions

None -- keyboard behavior is provided by the browser-native color input.

## ARIA

- `aria-label="..."` -- provides an accessible name for the color input since it has no visible `<label>` element

## References

- MDN `<input type="color">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color
