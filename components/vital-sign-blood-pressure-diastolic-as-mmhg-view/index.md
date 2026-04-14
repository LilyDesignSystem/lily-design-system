# Vital Sign Blood Pressure Diastolic As Mmhg View

VitalSignBloodPressureDiastolicAsMmhgView is a headless read-only display of a diastolic blood pressure value in mmHg. It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's diastolic blood pressure in medical records, health dashboards, vital sign summaries, and wellness applications.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "80 mmHg diastolic")
- The `value` prop is the integer diastolic blood pressure in mmHg
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignBloodPressureDiastolicAsMmhgInput for the Input/View pattern

## Props

- `value`: number (required) -- diastolic blood pressure value in mmHg
- `label`: string (required) -- accessible description via `aria-label` (e.g., "80 mmHg diastolic")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded diastolic blood pressure -->
<VitalSignBloodPressureDiastolicAsMmhgView value={80} label="Diastolic blood pressure: 80 mmHg" />

<!-- Paired with systolic in a patient summary -->
<VitalSignBloodPressureSystolicAsMmhgView value={120} label="Systolic: 120 mmHg" />
<VitalSignBloodPressureDiastolicAsMmhgView value={80} label="Diastolic: 80 mmHg" />

<!-- In a vital signs dashboard with color-coded ranges -->
<VitalSignBloodPressureDiastolicAsMmhgView value={92} label="92 mmHg diastolic - Stage 2 hypertension" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded diastolic blood pressure value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries alongside systolic readings.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in hypertension monitoring displays and cardiovascular risk profiles.

## When Not to Use

- Do not use for entering new values -- use VitalSignBloodPressureDiastolicAsMmhgInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for systolic blood pressure display -- use VitalSignBloodPressureSystolicAsMmhgView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for normal/abnormal ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-blood-pressure-diastolic-as-mmhg-view` class for targeting. Common styling includes color coding for blood pressure categories (green for normal <80, orange for stage 1 hypertension 80-89, red for stage 2 hypertension >=90).

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "mmHg" as a unit label alongside the number. Use color coding to indicate blood pressure categories: normal (<80), stage 1 hypertension (80-89), stage 2 hypertension (>=90).
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "80 mmHg diastolic"). Consider using `data-value` for conditional CSS styling based on category.

## Domain Knowledge

Blood pressure measures the force of blood against artery walls, with normal readings typically below 120/80 mmHg. The diastolic value (bottom number) measures the pressure when the heart rests between beats.

- Normal: Less than 80 mmHg diastolic.
- Stage 1 Hypertension: 80-89 mmHg diastolic OR 130-139 systolic.
- Stage 2 Hypertension: 90 or higher diastolic OR 140 or higher systolic.
- Hypertensive Crisis: Higher than 120 diastolic AND/OR higher than 180 systolic.
- Management: Reduce salt intake, regular physical activity, maintain healthy weight, and smoking cessation.
- When to Seek Help: If reading is higher than 180/120 with symptoms such as chest pain, shortness of breath, back pain, numbness/weakness, or changes in vision.

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- American Heart Association - Understanding Blood Pressure Readings: https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings
