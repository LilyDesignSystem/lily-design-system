# Angle Slider Range Input

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
- Supports two-way binding for two-way value binding
- `aria-valuetext` provides human-readable angle text (e.g., "90") for screen readers
- Customizable suffix via `valueTextSuffix` prop (default "°", can be " degrees" etc.)
- derived value computes valueText reactively from value and suffix

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

```html
<AngleSliderRangeInput label="Rotation" value={angle} />
<p>Angle: {angle} degrees</p>
```

With step snapping (every 15 degrees):

```html
<AngleSliderRangeInput label="Direction" value={direction} step={15} />
```

Custom range and suffix:

```html
<AngleSliderRangeInput
  label="Tilt"
  value={tilt}
  min={-90}
  max={90}
  valueTextSuffix=" degrees"
/>
```

Disabled slider:

```html
<AngleSliderRangeInput label="Locked rotation" value={45} disabled />
```

Within a form:

```html
<form>
  <AngleSliderRangeInput label="Gradient angle" value={angle} name="gradient-angle" id="gradient" />
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

## When to Use

- Use for selecting an angle in degrees, such as rotation, compass direction, or gradient angle.
- Use when you need a slider with degree-specific semantics and screen reader value text (e.g., "90 degrees").
- Use for tilt adjustments, CSS gradient angle pickers, or image rotation controls.

## When Not to Use

- Do not use for linear value ranges -- use RangeInput or Slider instead.
- Do not use for rotary value selection without degree semantics -- use Dial instead.
- Do not use for general numeric input without angular meaning -- use NumberInput instead.

## Headless

This component provides a native `<input type="range">` with ARIA slider attributes (`aria-valuetext` with degree formatting, `aria-label`, `aria-valuemin`, `aria-valuemax`) and zero visual styling. The consumer is responsible for all CSS including track appearance, thumb styling, tick marks, and any visual degree indicator or dial overlay.


## Styles

The consumer provides all CSS styling. The component renders with a `.angle-slider-range-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `angle-slider-range-input`
- Verify role="slider"` (implicit from input[type="range"])
- Verify aria-label` from label prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Consider pairing the slider with a visual degree indicator (circular dial or angle preview) so users can see the selected angle. Ensure the thumb has a minimum 44x44px touch target on mobile.
- **Developers**: Use the `step` prop to snap to common increments (15, 45, 90 degrees) when fine-grained control is not needed. Test that `aria-valuetext` announcements are clear with screen readers.

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/slider/
