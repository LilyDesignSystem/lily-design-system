# Dial

A circular dial or knob control that allows users to adjust a numeric value within a defined range. Dials provide an intuitive interaction model inspired by physical knobs found on devices like volume controls, thermostats, and audio equipment. This component is useful in control panels, audio applications, configuration interfaces, and anywhere a value needs fine-grained adjustment.

The component renders as a `div` with `role="slider"` and full keyboard navigation support. It exposes a bindable `value` prop for two-way data flow with configurable `min`, `max`, and `step` constraints. The Shift key modifier enables coarse adjustment at 10x the normal step size.

## Implementation Notes

- Renders a `<div>` with `role="slider"` since there is no native dial HTML element
- Uses `$bindable()` on the `value` prop for two-way binding with the parent
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

```svelte
<Dial label="Volume" bind:value min={0} max={100} />
```

```svelte
<script lang="ts">
  let brightness = $state(50);
</script>

<Dial label="Brightness" bind:value={brightness} min={0} max={100} step={5} />
<p>Brightness: {brightness}%</p>
```

```svelte
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

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
- WAI-ARIA slider role: https://www.w3.org/TR/wai-aria-1.2/#slider
