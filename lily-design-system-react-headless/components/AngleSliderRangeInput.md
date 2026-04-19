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
- The `value` prop supports controlled component usage
- `aria-valuetext` provides human-readable angle text (e.g., "90") for screen readers
- Customizable suffix via `valueTextSuffix` prop (default "°", can be " degrees" etc.)
- `useMemo()` computes valueText from value and suffix

## Props

- `value`: number (default: 0, controlled) -- current angle in degrees
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

```tsx

  import AngleSliderRangeInput from './AngleSliderRangeInput';

  const [angle, setAngle] = useState(0);


<AngleSliderRangeInput label="Rotation" value={angle} onChange={setAngle} />
<p>Angle: {angle} degrees</p>
```

With step snapping (every 15 degrees):

```tsx

  import AngleSliderRangeInput from './AngleSliderRangeInput';

  const [direction, setDirection] = useState(90);


<AngleSliderRangeInput label="Direction" value={direction} onChange={setDirection} step={15} />
```

Custom range and suffix:

```tsx
<AngleSliderRangeInput
  label="Tilt"
  value={tilt} onChange={setTilt}
  min={-90}
  max={90}
  valueTextSuffix=" degrees"
/>
```

Disabled slider:

```tsx
<AngleSliderRangeInput label="Locked rotation" value={45} disabled />
```

Within a form:

```tsx
<form>
  <AngleSliderRangeInput label="Gradient angle" value={angle} onChange={setAngle} name="gradient-angle" id="gradient" />
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

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
