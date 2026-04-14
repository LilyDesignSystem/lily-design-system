# Vital Sign VO2 Max As Ml Per Kg Per Minute Input

VitalSignVO2MaxMlPerKgPerMinuteInput is a headless number input for entering a VO2 max value in milliliters of oxygen per kilogram of body mass per minute (ml/kg/min). It wraps a native `<input type="number">` with integer-only constraints and accessible labelling.

Use this component in medical forms, health assessments, fitness tracking screens, and wellness applications where users need to enter a VO2 max measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=0`, `max=100`, `step=1` for integer-only ml/kg/min entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignVO2MaxMlPerKgPerMinuteView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current VO2 max value in ml/kg/min; bindable with two-way binding
- `min`: number (default: `0`) -- minimum allowed value
- `max`: number (default: `100`) -- maximum allowed value
- `step`: number (default: `1`) -- increment step size (integer)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic VO2 max input -->
<VitalSignVO2MaxMlPerKgPerMinuteInput label="VO2 max (ml/kg/min)" value={42} />

<!-- In a fitness evaluation form -->
<VitalSignVO2MaxMlPerKgPerMinuteInput label="VO2 max" value={vo2max} required />

<!-- In a cardiovascular fitness assessment -->
<VitalSignHeartRateAsBeatsPerMinuteInput label="Resting heart rate (BPM)" value={restingHR} />
<VitalSignVO2MaxMlPerKgPerMinuteInput label="VO2 max (ml/kg/min)" value={vo2Value} />
```

## Keyboard Interactions

- Up Arrow: increment value by 1 (native browser behavior)
- Down Arrow: decrement value by 1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the VO2 max input

## When to Use

- Use in clinical forms to record a patient's VO2 max measurement in ml/kg/min.
- Use with the default min/max/step constraints (0-100, step 1) for standard integer entry.
- Use within fitness evaluation workflows and cardiovascular fitness assessments.
- Use in sports medicine forms and exercise capacity testing.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignVo2MaxAsMlPerKgPerMinuteView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and VO2-max-appropriate defaults (min=0, max=100, step=1). The consumer provides all visual styling including input dimensions, borders, validation error display, and unit label.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-vo2-max-as-ml-per-kg-per-minute-input` class for targeting. Common styling includes displaying "ml/kg/min" as a suffix label.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=0`, `max=100`, `step=1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "ml/kg/min" as a unit label near the input. Use fitness category indicators based on age and sex. Provide placeholder text like "30-60" to hint at common adult ranges.
- **Developers**: Use the default min/max/step constraints for standard VO2 max entry. The max of 100 accommodates elite athletes. Consider displaying fitness category feedback based on age and sex on blur.

## Domain Knowledge

VO2 max represents the maximum oxygen your body can use during exercise, measured in milliliters of oxygen per kilogram of body weight per minute (ml/kg/min). Higher numbers indicate better cardiovascular fitness.

- Lab-Based Testing (Gold Standard): Exercise on a treadmill or stationary bike with increasing intensity while wearing a face mask that measures gas exchange. Provides direct measurement of maximal oxygen consumption.
- Wearable Devices (Estimation): Garmin, Apple Watch, and other fitness trackers estimate VO2 max based on heart rate and GPS data during runs or brisk walks. Not as precise as lab tests but useful for tracking progress.
- Field Tests (DIY Estimation): Cooper Test (12-minute run) or Rockport Walking Test provide estimated calculations based on distance, time, and heart rate.
- Interpretation: Higher numbers indicate better cardiovascular fitness. Values vary by age, sex, and fitness level.
- Best Time to Test: Perform tests when well-rested for accurate, high-effort measurement. Avoid strenuous exercise for 24-36 hours prior and stay hydrated.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- American College of Sports Medicine - VO2 Max: https://www.acsm.org/
