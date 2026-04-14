# Vital Sign Respiratory Rate As Breaths Per Minute Input

VitalSignRespiratoryRateAsBreathsPerMinuteInput is a headless number input for entering a respiratory rate value in breaths per minute (bpm). It wraps a native `<input type="number">` with integer-only constraints and accessible labelling.

Use this component in medical forms, health assessments, vital sign entry screens, and wellness applications where users need to enter a respiratory rate measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=0`, `max=100`, `step=1` for integer-only bpm entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignRespiratoryRateAsBreathsPerMinuteView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current bpm value; bindable with two-way binding
- `min`: number (default: `0`) -- minimum allowed value
- `max`: number (default: `100`) -- maximum allowed value
- `step`: number (default: `1`) -- increment step size (integer)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic respiratory rate input -->
<VitalSignRespiratoryRateAsBreathsPerMinuteInput label="Respiratory rate (breaths/min)" value={16} />

<!-- Required field in a triage assessment -->
<VitalSignRespiratoryRateAsBreathsPerMinuteInput label="Breathing rate" value={rate} required />

<!-- In a vital signs group entry -->
<VitalSignHeartRateAsBeatsPerMinuteInput label="Heart rate (BPM)" value={heartRate} />
<VitalSignRespiratoryRateAsBreathsPerMinuteInput label="Respiratory rate (breaths/min)" value={respRate} />
<VitalSignBodyTemperatureAsCelciusInput label="Temperature (°C)" value={temp} />
```

## Keyboard Interactions

- Up Arrow: increment value by 1 (native browser behavior)
- Down Arrow: decrement value by 1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the respiratory rate input

## When to Use

- Use in clinical forms to record a patient's respiratory rate measurement in breaths per minute.
- Use with the default min/max/step constraints (0-100, step 1) for standard integer entry.
- Use within vital sign entry workflows, triage forms, and patient intake assessments.
- Use in respiratory monitoring forms and post-operative care assessments.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignRespiratoryRateAsBreathsPerMinuteView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and respiratory-rate-appropriate defaults (min=0, max=100, step=1). The consumer provides all visual styling including input dimensions, borders, validation error display, and unit label.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-respiratory-rate-as-breaths-per-minute-input` class for targeting. Common styling includes displaying "bpm" as a suffix label and validation indicators for out-of-range values.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=0`, `max=100`, `step=1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "bpm" as a unit label near the input. Use validation indicators to flag values outside the normal adult range (12-20 bpm). Provide placeholder text like "12-20" to hint at the expected range.
- **Developers**: Use the default min/max/step constraints for standard respiratory rate entry. For pediatric use, consider adjusting the max value. Validate and display warnings for bradypnea (<12) or tachypnea (>20) ranges on blur.

## Domain Knowledge

A normal adult respiratory rate at rest is 12-20 breaths per minute (bpm), with rates under 12 or over 25 considered abnormal. As a key vital sign, it measures breaths per minute (inhalation and exhalation) to assess oxygenation and potential underlying illness.

- Normal Adult Range: 12-20 bpm. Some sources suggest a tighter 12-18 or 12-16 bpm range for optimal health.
- Abnormalities: Tachypnea is fast, shallow breathing (often >20-28 bpm in adults). Bradypnea is slow breathing (often <12 bpm).
- Normal Pediatric Ranges: Newborns: 30-60 bpm. 1 year old: 24-40 bpm. 3 years old: 20-30 bpm. 6 years old: 18-25 bpm. 10 years old: 17-23 bpm.
- Clinical Significance: A rate higher than 27 breaths per minute is a strong predictor of potential cardiac arrest in hospital settings.
- Factors: Exercise, anxiety, stress, fever, illness, and altitude can increase the respiratory rate.
- Measurement: Count the number of times the chest rises or falls in one full minute.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- MedlinePlus - Breathing Rate: https://medlineplus.gov/ency/article/002020.htm
