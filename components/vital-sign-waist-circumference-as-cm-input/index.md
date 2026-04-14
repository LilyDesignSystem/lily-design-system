# Vital Sign Waist Circumference As Cm Input

VitalSignWaistCircumferenceAsCmInput is a headless number input for entering a waist circumference value in centimetres (cm). It wraps a native `<input type="number">` with integer constraints and accessible labelling.

Use this component in medical forms, health assessments, and wellness applications where users need to enter a waist circumference measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=0`, `max=300`, `step=1` for whole-number centimetre entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignWaistCircumferenceAsCmView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current waist circumference value in cm; bindable with two-way binding
- `min`: number (default: `0`) -- minimum allowed value
- `max`: number (default: `300`) -- maximum allowed value
- `step`: number (default: `1`) -- increment step size (whole numbers)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic waist circumference input -->
<VitalSignWaistCircumferenceAsCmInput label="Waist circumference (cm)" value={94} />

<!-- Required field in a metabolic risk assessment -->
<VitalSignWaistCircumferenceAsCmInput label="Waist circumference" value={waist} required />

<!-- Alongside other body measurements -->
<VitalSignHeightAsCmInput label="Height (cm)" value={height} />
<VitalSignWeightAsKgInput label="Weight (kg)" value={weight} />
<VitalSignWaistCircumferenceAsCmInput label="Waist circumference (cm)" value={waistCirc} />
```

## Keyboard Interactions

- Up Arrow: increment value by 1 (native browser behavior)
- Down Arrow: decrement value by 1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the waist circumference input

## When to Use

- Use in clinical forms to record a patient's waist circumference measurement in centimetres.
- Use with the default min/max/step constraints (0-300, step 1) for standard integer centimetre entry.
- Use within metabolic risk assessment workflows and body composition evaluations.
- Use in obesity screening forms and cardiovascular risk assessments.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignWaistCircumferenceAsCmView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for belly circumference -- use VitalSignBellyCircumferenceAsCmInput instead.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and waist circumference-appropriate defaults (min=0, max=300, step=1). The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-waist-circumference-as-cm-input` class for targeting. Common styling includes displaying "cm" as a suffix label.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=0`, `max=300`, `step=1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "cm" as a unit label near the input. Use validation indicators to flag values in the high-risk range. Provide placeholder text like "94" to hint at the expected format.
- **Developers**: Use the default min/max/step constraints for standard waist circumference entry. The step of 1 ensures whole-number precision in centimetres.

## Domain Knowledge

Many experts and health organizations now consider waist circumference an important vital sign in clinical practice, alongside measures like blood pressure and heart rate, as it is a key indicator of visceral fat, metabolic risk, and long-term health, often predicting disease better than BMI alone.

- Indicates Hidden Fat: Unlike subcutaneous fat (felt under the skin), a large waist indicates higher levels of visceral fat—dangerous fat surrounding organs like the liver and heart.
- Predicts Disease Risk: A high waist circumference is strongly linked to a higher risk of type 2 diabetes, heart disease, stroke, and high blood pressure, even in people with a healthy BMI.
- More Accurate than BMI: While BMI only measures total weight, waist size specifically highlights central adiposity, offering a more accurate picture of metabolic health.
- Simple Diagnostic Tool: It is a quick, simple measurement that serves as an early warning sign of health risks, with experts recommending it be taken routinely by health professionals.
- Goal: Keep your waist circumference to less than half your height.
- High Risk: Risk increases for men with a waist over 94 cm and women over 80 cm.
- Very High Risk: Action should be taken if your waist is more than 102 cm for men or 88 cm for women.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- NHS - Health risks of obesity: https://www.nhs.uk/conditions/obesity/
- WHO - Waist Circumference and Waist-Hip Ratio: https://www.who.int/publications/i/item/9789241501491
