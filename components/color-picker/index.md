# Color Picker

A 2D area selector for choosing colors by saturation (X axis) and brightness (Y axis). Users navigate the board with keyboard arrow keys, with Shift held for larger steps. The component exposes `data-x` and `data-y` attributes for CSS-based cursor positioning, enabling consumers to render a visual indicator at the selected coordinates.

This component is useful for advanced color pickers where the user needs fine-grained 2D selection of color properties.

## Implementation Notes

- Renders a `<div>` with `role="slider"` for ARIA slider semantics
- Supports two-way binding for both `x` and `y` coordinates (range 0-100)
- Implements `onkeydown` handler for arrow key navigation with step size of 1 (or 10 with Shift)
- Home key resets `x` to 0; End key sets `x` to 100
- Exposes `data-x` and `data-y` attributes for CSS positioning of a visual cursor
- `tabindex` is set to 0 when enabled, -1 when disabled
- `aria-disabled` is set only when disabled (omitted otherwise via `|| undefined`)

## Props

- `x`: number (default: `0`) -- horizontal position (0-100, saturation), two-way bindable via `x`
- `y`: number (default: `0`) -- vertical position (0-100, brightness), two-way bindable via `y`
- `label`: string (required) -- accessible name via `aria-label`
- `disabled`: boolean (default: `false`) -- whether the control is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```html
<ColorPicker label="Color saturation and brightness" x={x} y={y} />
```

## Keyboard Interactions

- ArrowRight: increase X by 1 (Shift: by 10)
- ArrowLeft: decrease X by 1 (Shift: by 10)
- ArrowUp: decrease Y by 1 (Shift: by 10)
- ArrowDown: increase Y by 1 (Shift: by 10)
- Home: set X to 0
- End: set X to 100

## ARIA

- `role="slider"` -- identifies the element as a slider control
- `aria-label="..."` -- provides an accessible name for the slider
- `aria-valuenow` -- current X value (0-100)
- `aria-valuemin="0"` -- minimum slider value
- `aria-valuemax="100"` -- maximum slider value
- `aria-disabled="true"` -- set when the control is disabled

## When to Use

- Use for a two-dimensional board for picking colours by hue and saturation.
- Use in design tools, theme editors, or branding configuration where fine-grained colour selection is needed.
- Use alongside hue and opacity sliders for a complete colour selection interface.

## When Not to Use

- Do not use when the native browser picker is sufficient -- use ColorInput for simple hex colour selection.
- Do not use for a small set of preset colours -- use a group of ColorPickerButton components instead.

## Headless

This headless ColorPicker component provides a `<div>` with `role="slider"`, `aria-valuenow`/`aria-valuemin`/`aria-valuemax` for ARIA compliance, keyboard navigation with arrow keys (and Shift for larger steps), and `data-x`/`data-y` attributes for cursor positioning. The consumer provides all visual styling including the color gradient background, cursor indicator, border, and dimensions.


## Styles

The consumer provides all CSS styling. The component renders with a `.color-picker` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `color-picker`
- Verify role="slider"` -- identifies the element as a slider control
- Verify aria-label="..."` -- provides an accessible name for the slider
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display a visual cursor indicator at the selected position on the 2D area. Use a gradient background showing saturation and brightness to help users understand the mapping.
- **Developers**: Use the `data-x` and `data-y` attributes in CSS to position a cursor element with `calc()` or CSS custom properties. Combine with a hue slider for a complete color picker.

## Composition

ColorPicker is the parent component in the ColorPicker/ColorPickerButton composition pattern. Use ColorPicker for free-form 2D color selection, and ColorPickerButton for individual predefined color swatches. They can be combined in a single interface where ColorPickerButton offers quick presets and ColorPicker provides fine-grained adjustment.

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
