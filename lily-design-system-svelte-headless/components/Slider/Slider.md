# Slider

A slider is a UI/UX component that allows users to select a numeric value by dragging a handle along a track, typically used for adjusting settings like volume, brightness, price ranges, or timelines. It provides an intuitive and interactive way to input data within a defined minimum and maximum range.

This headless component wraps a native `<input type="range">` element with configurable min, max, and step values, providing two-way binding for reactive state management and an accessible label for screen readers.

## Implementation Notes

- Uses a native `<input type="range">` element for built-in browser slider behavior
- Supports `$bindable()` for two-way binding of the `value` prop
- Accepts `...restProps` for forwarding additional attributes to the input element
- No internal state management beyond the bindable value -- relies on native input behavior

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: number (default: 50) -- current slider value; bindable
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 100) -- maximum allowed value
- `step`: number (default: 1) -- increment between allowed values
- `disabled`: boolean (default: false) -- whether the slider is disabled

## Usage

```svelte
<Slider label="Volume" bind:value min={0} max={100} step={5} />
```

## Keyboard Interactions

- Left Arrow / Down Arrow: Decrease value by one step
- Right Arrow / Up Arrow: Increase value by one step
- Home: Set to minimum value
- End: Set to maximum value
- Page Up: Increase by a larger step (browser-dependent)
- Page Down: Decrease by a larger step (browser-dependent)

(These are provided by the native `<input type="range">` element.)

## ARIA

- `aria-label={label}` -- provides an accessible name for the slider

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
- MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
