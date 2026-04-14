# Vital Sign Height As Cm Input

VitalSignHeightAsCmInput is a headless number input for entering a height value in centimetres (cm). It wraps a native `<input type="number">` with integer constraints and accessible labelling.

Use this component in medical forms, health assessments, and wellness applications where users need to enter a height measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=0`, `max=300`, `step=1` for whole-number centimetre entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignHeightAsCmView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current height value in cm; bindable with two-way binding
- `min`: number (default: `0`) -- minimum allowed value
- `max`: number (default: `300`) -- maximum allowed value
- `step`: number (default: `1`) -- increment step size (whole numbers)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic height input in a clinical form -->
<VitalSignHeightAsCmInput label="Height (cm)" value={175} />

<!-- Required field in a patient intake form -->
<VitalSignHeightAsCmInput label="Height" value={height} required />

<!-- Alongside weight for BMI calculation -->
<VitalSignHeightAsCmInput label="Height (cm)" value={height} required />
<VitalSignWeightAsKgInput label="Weight (kg)" value={weight} required />
```

## Keyboard Interactions

- Up Arrow: increment value by 1 (native browser behavior)
- Down Arrow: decrement value by 1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the height input

## When to Use

- Use in clinical forms to record a patient's height measurement in centimetres.
- Use with the default min/max/step constraints (0-300, step 1) for standard integer centimetre entry.
- Use within patient intake workflows, growth monitoring, and BMI calculation forms.
- Use alongside VitalSignWeightAsKgInput for body composition assessments.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignHeightAsCmView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and height-appropriate defaults (min=0, max=300, step=1). The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-height-as-cm-input` class for targeting. Common styling includes displaying "cm" as a suffix label.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=0`, `max=300`, `step=1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "cm" as a unit label near the input. Provide placeholder text like "175" to hint at the expected format. Consider showing a height conversion reference.
- **Developers**: Use the default min/max/step constraints for standard height entry. The step of 1 ensures whole-number precision in centimetres.

## Domain Knowledge

Height is generally considered a key vital sign alongside weight, used to calculate body mass index (BMI) and determine medication dosages. While not an indicator of acute, rapid changes like blood pressure or heart rate, it is crucial for assessing long-term health, growth, and chronic disease risk.

- Contextual Importance: Height is essential in pediatrics to monitor development and in adults for calculating medication dosages and, in some cases, ventilator settings.
- Clinical Value: It is used to calculate Body Mass Index (BMI) to assess nutritional status and obesity-related risks.
- Health Risk Indicators: Research indicates that shorter height can be associated with higher pulse pressure and blood pressure.
- Documentation: It is typically recorded during initial physical evaluations or, for children, at every visit.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- NHS - BMI healthy weight calculator: https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/
