# AngleSliderRangeInput

An angle slider range input is a specialized range input component for selecting
an angle value, typically between 0 and 360 degrees. Built on the native HTML
range input, it provides semantic ARIA slider attributes including value text
that conveys
the angle with a degree symbol to screen readers.

Common uses include rotation controls, compass direction selectors, gradient
angle pickers, and any interface where a circular or angular value needs to be
selected by the user. The step property allows snapping to common increments
like 15 or 45 degrees.

## Implementation Notes

- Built on native `<input type="range">` for inherent slider behavior
- Uses `$bindable()` for two-way value binding
- `aria-valuetext` provides human-readable angle text (e.g., "90") for screen readers
- Customizable suffix via `valueTextSuffix` prop (default "°", can be " degrees" etc.)
- `$derived()` computes valueText reactively from value and suffix

## Props

- `value`: number (default: 0, bindable) -- current angle in degrees
- `min`: number (default: 0) -- minimum angle
- `max`: number (default: 360) -- maximum angle
- `step`: number (default: 1) -- step increment
- `label`: string (required) -- accessible label
- `disabled`: boolean (default: false)
- `name`: string (optional) -- form field name
- `id`: string (optional) -- element ID
- `valueTextSuffix`: string (default: "°") -- suffix for aria-valuetext
- `...restProps`: Any additional HTML attributes

## Usage

Basic angle slider range input:

```svelte
<script lang="ts">
  import AngleSliderRangeInput from './AngleSliderRangeInput.svelte';

  let angle = $state(0);
</script>

<AngleSliderRangeInput label="Rotation" bind:value={angle} />
<p>Angle: {angle} degrees</p>
```

With step snapping (every 15 degrees):

```svelte
<script lang="ts">
  import AngleSliderRangeInput from './AngleSliderRangeInput.svelte';

  let direction = $state(90);
</script>

<AngleSliderRangeInput label="Direction" bind:value={direction} step={15} />
```

Custom range and suffix:

```svelte
<AngleSliderRangeInput
  label="Tilt"
  bind:value={tilt}
  min={-90}
  max={90}
  valueTextSuffix=" degrees"
/>
```

Disabled slider:

```svelte
<AngleSliderRangeInput label="Locked rotation" value={45} disabled />
```

Within a form:

```svelte
<form>
  <AngleSliderRangeInput label="Gradient angle" bind:value={angle} name="gradient-angle" id="gradient" />
</form>
```

## Keyboard Interactions

- Arrow Right/Up: Increase value by step
- Arrow Left/Down: Decrease value by step
- Home: Set to minimum
- End: Set to maximum
- (All handled natively by input[type="range"])

## ARIA

- `role="slider"` (implicit from input[type="range"])
- `aria-label` from label prop
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-valuetext` for human-readable angle (e.g., "90°")

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
