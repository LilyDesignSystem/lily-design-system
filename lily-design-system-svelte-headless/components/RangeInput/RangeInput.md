# RangeInput

A range input is a UI/UX component that provides a slider control for selecting a numeric value within a defined range. It uses the native HTML `<input type="range">` element, which renders as a draggable track and handle. The component supports configurable minimum, maximum, and step values, and provides a bindable value prop for two-way data binding. An aria-label ensures the control is accessible to screen readers and assistive technologies.

Range inputs are commonly used for volume controls, brightness settings, price filters, and any scenario where users need to select a value from a continuous numeric spectrum.

## Implementation Notes

- Renders a single `<input type="range">` element for native slider behavior
- Uses `$bindable()` for the `value` prop enabling two-way data binding with `bind:value`
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `class`)
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Default value is 50, centered in the default 0-100 range

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: number (default: 50) -- current numeric value, bindable with `bind:value`
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 100) -- maximum allowed value
- `step`: number (default: 1) -- increment between selectable values
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Usage

```svelte
<RangeInput label="Volume" bind:value min={0} max={100} />
```

```svelte
<RangeInput label="Price range" bind:value={price} min={10} max={500} step={10} />
```

## Keyboard Interactions

- Left Arrow / Down Arrow: decrease value by one step
- Right Arrow / Up Arrow: increase value by one step
- Home: set to minimum value
- End: set to maximum value
- Page Down: decrease by a larger step (browser-defined)
- Page Up: increase by a larger step (browser-defined)

Note: keyboard interactions are provided natively by the `<input type="range">` element.

## ARIA

- `aria-label={label}` -- provides the accessible name for the slider control since no visible label element is associated

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
- MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
