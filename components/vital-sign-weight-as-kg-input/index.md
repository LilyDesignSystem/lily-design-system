# Vital Sign Weight As Kg Input

VitalSignWeightAsKgInput is a headless number input for entering a weight value in kilograms (kg). It wraps a native `<input type="number">` with integer constraints and accessible labelling.

Use this component in medical forms, health assessments, and wellness applications where users need to enter a weight measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=0`, `max=500`, `step=1` for whole-number kilogram entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignWeightAsKgView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current weight value in kg; bindable with two-way binding
- `min`: number (default: `0`) -- minimum allowed value
- `max`: number (default: `500`) -- maximum allowed value
- `step`: number (default: `1`) -- increment step size (whole numbers)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic weight input in a clinical form -->
<VitalSignWeightAsKgInput label="Weight (kg)" value={75} />

<!-- Required field in a patient intake form -->
<VitalSignWeightAsKgInput label="Weight" value={weight} required />

<!-- Alongside height for BMI calculation -->
<VitalSignHeightAsCmInput label="Height (cm)" value={height} required />
<VitalSignWeightAsKgInput label="Weight (kg)" value={weight} required />
```

## Keyboard Interactions

- Up Arrow: increment value by 1 (native browser behavior)
- Down Arrow: decrement value by 1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the weight input

## When to Use

- Use in clinical forms to record a patient's weight measurement in kilograms.
- Use with the default min/max/step constraints (0-500, step 1) for standard integer kilogram entry.
- Use within patient intake workflows, medication dosage calculations, and BMI assessments.
- Use alongside VitalSignHeightAsCmInput for body composition evaluations.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignWeightAsKgView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and weight-appropriate defaults (min=0, max=500, step=1). The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-weight-as-kg-input` class for targeting. Common styling includes displaying "kg" as a suffix label.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=0`, `max=500`, `step=1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "kg" as a unit label near the input. Provide placeholder text like "75" to hint at the expected format. Consider showing BMI calculation when used alongside height.
- **Developers**: Use the default min/max/step constraints for standard weight entry. The step of 1 ensures whole-number precision in kilograms.

## Domain Knowledge

Weight is a key metric often included in assessments of physiological function, acting alongside standard vital signs to monitor health and guide treatment. While not always one of the cardinal four (pulse, blood pressure, respiration, temperature), it is critical for calculating medication dosages, tracking metabolic health, and identifying risks like obesity-related disease.

- Significance: Unplanned, sudden, or significant weight gain or loss should always be discussed with a healthcare professional.
- Assessment: It is often paired with height to determine BMI, which helps classify if an individual is in a healthy, underweight, overweight, or obese range.
- Additional Metrics: Waist circumference is increasingly used as a vital sign to assess visceral obesity.
- Method: Patients should stand still on a calibrated scale, typically in light clothing, to ensure accuracy.
- Adults: There is no single "normal" weight, but BMI and waist circumference are used to determine healthy ranges for individuals.
- Children: Pediatric weight is measured against growth charts to monitor development.
- Impact on Other Vitals: High weight can lead to increased blood pressure, as the heart must work harder to supply blood to the body.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- NHS - BMI healthy weight calculator: https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/
