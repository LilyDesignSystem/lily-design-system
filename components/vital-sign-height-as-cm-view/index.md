# Vital Sign Height As Cm View

VitalSignHeightAsCmView is a headless read-only display of a height value in centimetres (cm). It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's height in medical records, health dashboards, vital sign summaries, and wellness applications.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "175 cm height")
- The `value` prop is the height in centimetres as an integer
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignHeightAsCmInput for the Input/View pattern

## Props

- `value`: number (required) -- height value in centimetres
- `label`: string (required) -- accessible description via `aria-label` (e.g., "175 cm height")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded height -->
<VitalSignHeightAsCmView value={175} label="Height: 175 cm" />

<!-- In a patient record alongside weight -->
<VitalSignHeightAsCmView value={168} label="Height: 168 cm" />
<VitalSignWeightAsKgView value={72} label="Weight: 72 kg" />

<!-- In a pediatric growth summary -->
<VitalSignHeightAsCmView value={120} label="Height: 120 cm - 75th percentile" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded height value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing body measurements.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use alongside VitalSignWeightAsKgView for BMI context in health profiles.

## When Not to Use

- Do not use for entering new values -- use VitalSignHeightAsCmInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for weight display -- use VitalSignWeightAsKgView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-height-as-cm-view` class for targeting. Common styling includes displaying "cm" as a unit label alongside the number.

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "cm" as a unit label alongside the number. Consider showing contextual information such as BMI when used alongside weight.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "175 cm height"). Consider using `data-value` for conditional CSS styling.

## Domain Knowledge

Height is generally considered a key vital sign alongside weight, used to calculate body mass index (BMI) and determine medication dosages. While not an indicator of acute, rapid changes like blood pressure or heart rate, it is crucial for assessing long-term health, growth, and chronic disease risk.

- Contextual Importance: Height is essential in pediatrics to monitor development and in adults for calculating medication dosages and, in some cases, ventilator settings.
- Clinical Value: It is used to calculate Body Mass Index (BMI) to assess nutritional status and obesity-related risks.
- Health Risk Indicators: Research indicates that shorter height can be associated with higher pulse pressure and blood pressure.
- Documentation: It is typically recorded during initial physical evaluations or, for children, at every visit.

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- NHS - BMI healthy weight calculator: https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/
