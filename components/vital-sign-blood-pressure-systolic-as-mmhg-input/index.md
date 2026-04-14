# Vital Sign Blood Pressure Systolic As Mmhg Input

VitalSignBloodPressureSystolicAsMmhgInput is a headless number input for entering a systolic blood pressure value in mmHg. It wraps a native `<input type="number">` with integer-only constraints and accessible labelling.

Use this component in medical forms, health assessments, vital sign entry screens, and wellness applications where users need to enter a systolic blood pressure measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=0`, `max=300`, `step=1` for integer-only mmHg entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignBloodPressureSystolicAsMmhgView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current systolic value in mmHg; bindable with two-way binding
- `min`: number (default: `0`) -- minimum allowed value
- `max`: number (default: `300`) -- maximum allowed value
- `step`: number (default: `1`) -- increment step size (integer)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic systolic blood pressure input -->
<VitalSignBloodPressureSystolicAsMmhgInput label="Systolic blood pressure (mmHg)" value={120} />

<!-- Paired with diastolic in a blood pressure form -->
<VitalSignBloodPressureSystolicAsMmhgInput label="Systolic blood pressure (mmHg)" value={systolic} required />
<VitalSignBloodPressureDiastolicAsMmhgInput label="Diastolic blood pressure (mmHg)" value={diastolic} required />

<!-- In a triage assessment form -->
<VitalSignBloodPressureSystolicAsMmhgInput label="Systolic BP" value={systolic} required disabled={isReadOnly} />
```

## Keyboard Interactions

- Up Arrow: increment value by 1 (native browser behavior)
- Down Arrow: decrement value by 1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the systolic blood pressure input

## When to Use

- Use in clinical forms to record a patient's systolic blood pressure measurement in mmHg.
- Use paired with VitalSignBloodPressureDiastolicAsMmhgInput for complete blood pressure entry.
- Use with the default min/max/step constraints (0-300, step 1) for standard integer mmHg entry.
- Use within vital sign entry workflows, triage forms, and patient intake assessments.
- Use in hypertension screening and cardiovascular risk assessment forms.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignBloodPressureSystolicAsMmhgView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.
- Do not use for diastolic blood pressure -- use VitalSignBloodPressureDiastolicAsMmhgInput instead.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and blood-pressure-appropriate defaults (min=0, max=300, step=1). The consumer provides all visual styling including input dimensions, borders, validation error display, and unit label.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-blood-pressure-systolic-as-mmhg-input` class for targeting. Common styling includes displaying "mmHg" as a suffix label and validation indicators for out-of-range values.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=0`, `max=300`, `step=1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "mmHg" as a unit label near the input. Use color coding to indicate blood pressure categories. Provide placeholder text like "120" to hint at the expected normal value.
- **Developers**: Use the default min/max/step constraints for standard blood pressure entry. Validate and display category-based feedback (normal, elevated, stage 1, stage 2, crisis) on blur.

## Domain Knowledge

Blood pressure measures the force of blood against artery walls, with normal readings typically below 120/80 mmHg. The systolic value (top number) measures the pressure when the heart beats.

- Normal: Less than 120 mmHg systolic.
- Elevated: 120-129 mmHg systolic AND less than 80 diastolic.
- Stage 1 Hypertension: 130-139 mmHg systolic OR 80-89 diastolic.
- Stage 2 Hypertension: 140 or higher systolic OR 90 or higher diastolic.
- Hypertensive Crisis: Higher than 180 systolic AND/OR higher than 120 diastolic.
- Management: Reduce salt intake, regular physical activity, maintain healthy weight, and smoking cessation.
- When to Seek Help: If reading is higher than 180/120 with symptoms such as chest pain, shortness of breath, back pain, numbness/weakness, or changes in vision.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- American Heart Association - Understanding Blood Pressure Readings: https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings
