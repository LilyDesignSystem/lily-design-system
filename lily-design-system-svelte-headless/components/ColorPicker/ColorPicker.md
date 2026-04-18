# ColorPicker

A 2D area selector for choosing colors by saturation (X axis) and brightness (Y axis). Users navigate the board with keyboard arrow keys, with Shift held for larger steps. The component exposes `data-x` and `data-y` attributes for CSS-based cursor positioning, enabling consumers to render a visual indicator at the selected coordinates.

This component is useful for advanced color pickers where the user needs fine-grained 2D selection of color properties.

## Implementation Notes

- Renders a `<div>` with `role="slider"` for ARIA slider semantics
- Uses `$bindable()` for both `x` and `y` coordinates (range 0-100)
- Implements `onkeydown` handler for arrow key navigation with step size of 1 (or 10 with Shift)
- Home key resets `x` to 0; End key sets `x` to 100
- Exposes `data-x` and `data-y` attributes for CSS positioning of a visual cursor
- `tabindex` is set to 0 when enabled, -1 when disabled
- `aria-disabled` is set only when disabled (omitted otherwise via `|| undefined`)

## Props

- `x`: number (default: `0`) -- horizontal position (0-100, saturation), bindable via `bind:x`
- `y`: number (default: `0`) -- vertical position (0-100, brightness), bindable via `bind:y`
- `label`: string (required) -- accessible name via `aria-label`
- `disabled`: boolean (default: `false`) -- whether the control is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```svelte
<ColorPicker label="Color saturation and brightness" bind:x bind:y />
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

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
