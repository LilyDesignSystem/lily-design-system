# Vital Sign Body Fat As Percentage Input

VitalSignBodyFatAsPercentageInput is a headless number input for entering a body fat percentage (BFP) value. It wraps a native `<input type="number">` with decimal-precision constraints and accessible labelling.

Use this component in medical forms, health assessments, fitness tracking screens, and wellness applications where users need to enter a body fat percentage measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=0`, `max=100`, `step=0.1` for one-decimal-place percentage entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignBodyFatAsPercentageView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current BFP value; bindable with two-way binding
- `min`: number (default: `0`) -- minimum allowed value
- `max`: number (default: `100`) -- maximum allowed value
- `step`: number (default: `0.1`) -- increment step size (one decimal place)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic body fat percentage input -->
<VitalSignBodyFatAsPercentageInput label="Body fat percentage" value={22.5} />

<!-- Required field in a health assessment -->
<VitalSignBodyFatAsPercentageInput label="Body fat (%)" value={bfp} required />

<!-- In a fitness evaluation form with custom range -->
<VitalSignBodyFatAsPercentageInput label="Body fat percentage" value={bodyFat} min={2} max={60} />
```

## Keyboard Interactions

- Up Arrow: increment value by 0.1 (native browser behavior)
- Down Arrow: decrement value by 0.1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the body fat percentage input

## When to Use

- Use in clinical forms to record a patient's body fat percentage measurement.
- Use with the default min/max/step constraints (0-100, step 0.1) for one-decimal-place percentage entry.
- Use within health assessments, fitness evaluations, and body composition tracking workflows.
- Use in metabolic risk screening and obesity management forms.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignBodyFatAsPercentageView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and BFP-appropriate defaults (min=0, max=100, step=0.1). The consumer provides all visual styling including input dimensions, borders, validation error display, and unit label.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-body-fat-as-percentage-input` class for targeting. Common styling includes displaying "%" as a suffix label and validation indicators for out-of-range values.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=0`, `max=100`, `step=0.1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "%" as a unit label near the input. Use validation indicators to flag values outside healthy ranges (below 25% for men, below 32% for women). Provide placeholder text like "22.5" to hint at the expected format.
- **Developers**: Use the default min/max/step constraints for standard body fat percentage entry. The step of 0.1 ensures one-decimal-place precision. Validate and display warnings for unhealthy ranges on blur.

## Domain Knowledge

Body fat percentage (BFP) is a health marker that is more accurate than Body Mass Index (BMI) for predicting chronic disease risk, such as heart disease and type 2 diabetes. It assesses body composition, distinguishing fat from muscle, which is crucial for determining overall fitness, metabolic health, and risk for conditions like high blood pressure or insulin resistance.

- Superior to BMI: While Body Mass Index (BMI) is common, it is an imperfect measure that can misclassify muscular individuals as overweight. Body fat percentage offers a more direct, accurate assessment.
- Health Risks: High levels, particularly visceral fat, are linked to metabolic disorders, while excessively low levels can indicate poor nutrition or lack of protection for organs.
- Health Recommendations: Experts suggest healthy ranges are typically below 32% for women and 25% for men.
- Essential Fat: Women require approximately 10-13% essential fat; men require approximately 2-5%.
- Athletes: Female athletes typically range 14-20%; male athletes typically range 6-13%.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- American Council on Exercise - Body Fat Percentages: https://www.acefitness.org/resources/everyone/tools-calculators/percent-body-fat-calculator/
