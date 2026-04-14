# Vital Sign Waist Circumference As Cm View

VitalSignWaistCircumferenceAsCmView is a headless read-only display of a waist circumference value in centimetres (cm). It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's waist circumference in medical records, health dashboards, vital sign summaries, and wellness applications.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "94 cm waist circumference")
- The `value` prop is the waist circumference in centimetres as an integer
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignWaistCircumferenceAsCmInput for the Input/View pattern

## Props

- `value`: number (required) -- waist circumference value in centimetres
- `label`: string (required) -- accessible description via `aria-label` (e.g., "94 cm waist circumference")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded waist circumference -->
<VitalSignWaistCircumferenceAsCmView value={94} label="Waist circumference: 94 cm" />

<!-- In a metabolic risk dashboard -->
<VitalSignWaistCircumferenceAsCmView value={105} label="Waist: 105 cm - very high risk" />

<!-- Alongside other body measurements in a health summary -->
<VitalSignHeightAsCmView value={175} label="Height: 175 cm" />
<VitalSignWeightAsKgView value={82} label="Weight: 82 kg" />
<VitalSignWaistCircumferenceAsCmView value={88} label="Waist: 88 cm" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded waist circumference value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing body measurements.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in metabolic risk profiles and obesity screening reports.

## When Not to Use

- Do not use for entering new values -- use VitalSignWaistCircumferenceAsCmInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for belly circumference display -- use VitalSignBellyCircumferenceAsCmView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for healthy/unhealthy ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-waist-circumference-as-cm-view` class for targeting. Common styling includes color coding for ranges based on sex-specific thresholds (e.g., green for healthy, amber for high risk, red for very high risk).

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "cm" as a unit label alongside the number. Use color coding to indicate risk levels based on sex-specific thresholds. Consider showing both cm and inches for international audiences.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "94 cm waist circumference"). Consider using `data-value` for conditional CSS styling based on range.

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

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- NHS - Health risks of obesity: https://www.nhs.uk/conditions/obesity/
- WHO - Waist Circumference and Waist-Hip Ratio: https://www.who.int/publications/i/item/9789241501491
