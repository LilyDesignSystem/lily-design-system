# Vital Sign Weight As Kg View

VitalSignWeightAsKgView is a headless read-only display of a weight value in kilograms (kg). It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's weight in medical records, health dashboards, vital sign summaries, and wellness applications.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "75 kg weight")
- The `value` prop is the weight in kilograms as an integer
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignWeightAsKgInput for the Input/View pattern

## Props

- `value`: number (required) -- weight value in kilograms
- `label`: string (required) -- accessible description via `aria-label` (e.g., "75 kg weight")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded weight -->
<VitalSignWeightAsKgView value={75} label="Weight: 75 kg" />

<!-- In a patient record alongside height -->
<VitalSignHeightAsCmView value={175} label="Height: 175 cm" />
<VitalSignWeightAsKgView value={72} label="Weight: 72 kg" />

<!-- In a pediatric growth summary -->
<VitalSignWeightAsKgView value={32} label="Weight: 32 kg - 50th percentile" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded weight value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing body measurements.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use alongside VitalSignHeightAsCmView for BMI context in health profiles.

## When Not to Use

- Do not use for entering new values -- use VitalSignWeightAsKgInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for body fat percentage display -- use VitalSignBodyFatAsPercentageView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for healthy/unhealthy ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-weight-as-kg-view` class for targeting. Common styling includes displaying "kg" as a unit label alongside the number.

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "kg" as a unit label alongside the number. Consider showing contextual information such as BMI when used alongside height.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "75 kg weight"). Consider using `data-value` for conditional CSS styling.

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

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- NHS - BMI healthy weight calculator: https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/
