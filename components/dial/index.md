# Dial

A circular dial or knob control that allows users to adjust a numeric value within a defined range. Dials provide an intuitive interaction model inspired by physical knobs found on devices like volume controls, thermostats, and audio equipment. This component is useful in control panels, audio applications, configuration interfaces, and anywhere a value needs fine-grained adjustment.

The component renders as a `div` with `role="slider"` and full keyboard navigation support. It exposes a bindable `value` prop for two-way data flow with configurable `min`, `max`, and `step` constraints. The Shift key modifier enables coarse adjustment at 10x the normal step size.

## Implementation Notes

- Renders a `<div>` with `role="slider"` since there is no native dial HTML element
- Supports two-way binding on the `value` prop with the parent
- Internal `clamp()` function ensures the value always stays within the `min`/`max` range
- Keyboard handler supports both fine (arrow keys) and coarse (Shift+arrow) adjustment
- Home and End keys jump directly to `min` and `max` bounds
- The `tabindex` is set to `0` when enabled (focusable) or `-1` when disabled (not focusable)
- `aria-disabled` is only set when the dial is disabled; omitted otherwise

## Props

- `value`: number (default: 0) -- current dial value; bindable
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 100) -- maximum allowed value
- `step`: number (default: 1) -- increment per key press
- `label`: string (required) -- accessible name for the dial
- `disabled`: boolean (default: false) -- whether the dial is disabled

## Usage

```html
<Dial label="Volume" value={value} min={0} max={100} />
```

```html
<Dial label="Brightness" value={brightness} min={0} max={100} step={5} />
<p>Brightness: {brightness}%</p>
```

```html
<Dial label="Disabled control" value={30} disabled />
```

## Keyboard Interactions

- ArrowRight / ArrowUp: increase value by one step
- ArrowLeft / ArrowDown: decrease value by one step
- Shift + ArrowRight / ArrowUp: increase value by 10 steps
- Shift + ArrowLeft / ArrowDown: decrease value by 10 steps
- Home: set value to minimum
- End: set value to maximum

## ARIA

- `role="slider"` -- indicates a range input control
- `aria-label="{label}"` -- provides an accessible name for the dial
- `aria-valuenow="{value}"` -- communicates the current value to assistive technology
- `aria-valuemin="{min}"` -- communicates the minimum allowed value
- `aria-valuemax="{max}"` -- communicates the maximum allowed value
- `aria-disabled="true"` -- present only when the dial is disabled

## When to Use

- Use for a rotary control for selecting a value, such as a timer, temperature, or volume knob.
- Use for fine-grained numeric adjustment in control panels, audio interfaces, or configuration screens.
- Use when the knob metaphor is intuitive, such as physical device simulators or audio mixing applications.
- Use when the value range is bounded and continuous.

## When Not to Use

- Do not use when a linear slider is more intuitive -- use Slider instead.
- Do not use for angle-specific input in degrees -- use AngleSliderRangeInput instead.
- Do not use when users need to type an exact value -- use NumberInput instead.

## Headless

This headless component provides a `<div>` with `role="slider"`, full ARIA value attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`), keyboard navigation with fine and coarse step support, and two-way binding. The consumer provides all visual styling, the rotary knob appearance, and any value display.


## Styles

The consumer provides all CSS styling. The component renders with a `.dial` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `dial`
- Verify role="slider"` -- indicates a range input control
- Verify aria-label="{label}"` -- provides an accessible name for the dial
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide a clear visual indicator of the current value position on the dial. Include a numeric readout near the dial so users can see the exact value.
- **Developers**: Use the `step` prop to match the precision users need. The Shift+Arrow coarse adjustment (10x step) is built in, so choose a base step that makes both fine and coarse increments intuitive.

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
- WAI-ARIA slider role: https://www.w3.org/TR/wai-aria-1.2/#slider
