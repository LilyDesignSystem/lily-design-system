# Slider

A slider is a UI/UX component that allows users to select a numeric value by dragging a handle along a track, typically used for adjusting settings like volume, brightness, price ranges, or timelines. It provides an intuitive and interactive way to input data within a defined minimum and maximum range.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

This headless component wraps a native `<input type="range">` element with configurable min, max, and step values, providing two-way binding for reactive state management and an accessible label for screen readers.

## Implementation Notes

- Uses a native `<input type="range">` element for built-in browser slider behavior
- Supports two-way binding on the `value` prop
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

Volume control with step increments:

```html
<Slider label="Volume" value={volume} min={0} max={100} step={5} />
```

Brightness adjustment with displayed value:

```html
<Slider label="Brightness" value={brightness} min={0} max={100} />
<p>Brightness: {brightness}%</p>
```

Price range filter:

```html
<Slider label="Maximum price" value={maxPrice} min={0} max={500} step={10} />
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
- `aria-valuetext` (optional, via rest props) -- a human-readable value such as "50 percent" or "£20" when the bare number is not meaningful. The consumer formats it (with `Intl.NumberFormat`) and keeps it in step with the value; the component holds no locale.
- `role="slider"`, `aria-valuemin`, `aria-valuemax` and `aria-valuenow` come from the native `<input type="range">`

## When to Use

- Use for selecting a value along a continuous track, such as volume, brightness, or a numeric range.
- Use when approximate value selection is acceptable and a visual track provides helpful context.
- Use for adjusting settings like zoom level, playback speed, or opacity.
- Use when the full range should be visually represented to help users gauge their selection.

## When Not to Use

- Do not use when exact numeric input is needed -- use NumberInput instead.
- Do not use for confirming an action by sliding -- use SliderButton instead.
- Do not use for angle-specific selection in degrees -- use AngleSliderRangeInput instead.

## Headless

This headless component wraps a native `<input type="range">` element with `aria-label`, configurable min/max/step values, and two-way binding. It provides full native slider keyboard navigation and accessibility. The consumer provides all visual styling for the track, thumb, and any value labels.


## Reduced motion

Reduced motion changes how content appears, never whether it does. Apply it in consumer CSS under `@media (prefers-reduced-motion: reduce)` and under the `motion-picker`'s `[data-motion="reduce"]` on the document root (the 57 reference themes already honour both for the preference hooks they style). For a slider:

- **Suppress:** thumb and fill transitions, and any rubber-band or spring effect past the ends. The value updates at once.
- **Keep:** everything native to `<input type="range">`: the keys, the announced value, and `aria-valuetext`. The effect is decoration; the control works without it.

## Styles

The consumer provides all CSS styling. The component renders with a `.slider` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders an `<input type="range">` element with class `slider`
- Verify aria-label={label}` -- provides an accessible name for the slider
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display the current value near the slider thumb or in a nearby label so users can see the exact selection. Use a track fill color to indicate the selected portion of the range.
- **Developers**: Use the `step` prop to constrain values to meaningful increments. Consider debouncing the bound value if the slider drives expensive operations like API calls.

## Related components

- `range-input` — a slider input for selecting a value within a range <input type="range">
- `slider-button` — a button with a slider that the user needs to slide to confirm
- `dial` — a rotary dial control for selecting a value
- `angle-slider-range-input` — a range input for selecting an angle in degrees

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range

---

Lily™ and Lily Design System™ are trademarks.
