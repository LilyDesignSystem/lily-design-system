# Vital Sign Heart Rate As Beats Per Minute Input

VitalSignHeartRateAsBeatsPerMinuteInput is a headless number input for entering a heart rate value in beats per minute (BPM). It wraps a native `<input type="number">` with integer-only constraints and accessible labelling.

Use this component in medical forms, health assessments, vital sign entry screens, and wellness applications where users need to enter a heart rate measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=0`, `max=300`, `step=1` for integer-only BPM entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignHeartRateAsBeatsPerMinuteView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current BPM value; bindable with two-way binding
- `min`: number (default: `0`) -- minimum allowed value
- `max`: number (default: `300`) -- maximum allowed value
- `step`: number (default: `1`) -- increment step size (integer)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic heart rate input in a clinical form -->
<VitalSignHeartRateAsBeatsPerMinuteInput label="Heart rate (BPM)" value={72} />

<!-- Required field in a triage assessment -->
<VitalSignHeartRateAsBeatsPerMinuteInput label="Resting heart rate" value={rate} required />

<!-- In a vital signs group entry -->
<VitalSignHeartRateAsBeatsPerMinuteInput label="Heart rate" value={heartRate} disabled={isReadOnly} />
```

## Keyboard Interactions

- Up Arrow: increment value by 1 (native browser behavior)
- Down Arrow: decrement value by 1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the heart rate input

## When to Use

- Use in clinical forms to record a patient's heart rate measurement in beats per minute.
- Use with the default min/max/step constraints (0-300, step 1) for standard integer BPM entry.
- Use within vital sign entry workflows, triage forms, and patient intake assessments.
- Use in cardiac monitoring forms and fitness evaluation screens.
- Use alongside other vital sign inputs for comprehensive patient assessment.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignHeartRateAsBeatsPerMinuteView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.
- Do not use for heart rate variability -- use VitalSignHeartRateVariabilityInput instead.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and BPM-appropriate defaults (min=0, max=300, step=1). The consumer provides all visual styling including input dimensions, borders, validation error display, and unit label.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-heart-rate-as-beats-per-minute-input` class for targeting. Common styling includes displaying "BPM" as a suffix label and validation indicators for out-of-range values.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=0`, `max=300`, `step=1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "BPM" as a unit label near the input. Use validation indicators to flag values outside the normal adult range (60-100 BPM). Provide placeholder text like "60-100" to hint at the expected range.
- **Developers**: Use the default min/max/step constraints for standard adult heart rates. For pediatric use, consider adjusting the max value. Validate and display warnings for bradycardia (<60) or tachycardia (>100) ranges on blur.

## Domain Knowledge

The normal resting heart rate for healthy adults is 60 to 100 beats per minute (BPM), with lower rates (40-60 BPM) common in trained athletes. Rates generally rise with age in children but stabilize to adult levels around age 13-18.

- Optimal Range: While 60-100 is standard, many experts consider a resting rate between 50 and 70 BPM more optimal for cardiovascular health.
- Factors: Rates can increase due to stress, illness, injury, or exercise, and decrease during sleep.
- Abnormalities: A rate below 60 BPM (when not a fit athlete) is called bradycardia, while over 100 BPM is tachycardia.
- Children: Newborns: 70-200 BPM or 100-160 BPM. Infants (1-12 months): 80-160 BPM. Toddlers (1-3 years): 80-130 BPM. Children (6-12 years): 70-110 BPM.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- American Heart Association - Target Heart Rates: https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates
