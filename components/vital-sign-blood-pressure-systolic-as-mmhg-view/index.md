# Vital Sign Blood Pressure Systolic As Mmhg View

VitalSignBloodPressureSystolicAsMmhgView is a headless read-only display of a systolic blood pressure value in mmHg. It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's systolic blood pressure in medical records, health dashboards, vital sign summaries, and wellness applications.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "120 mmHg systolic")
- The `value` prop is the integer systolic blood pressure in mmHg
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignBloodPressureSystolicAsMmhgInput for the Input/View pattern

## Props

- `value`: number (required) -- systolic blood pressure value in mmHg
- `label`: string (required) -- accessible description via `aria-label` (e.g., "120 mmHg systolic")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded systolic blood pressure -->
<VitalSignBloodPressureSystolicAsMmhgView value={120} label="Systolic blood pressure: 120 mmHg" />

<!-- Paired with diastolic in a patient summary -->
<VitalSignBloodPressureSystolicAsMmhgView value={120} label="Systolic: 120 mmHg" />
<VitalSignBloodPressureDiastolicAsMmhgView value={80} label="Diastolic: 80 mmHg" />

<!-- In a vital signs dashboard with color-coded ranges -->
<VitalSignBloodPressureSystolicAsMmhgView value={142} label="142 mmHg systolic - Stage 2 hypertension" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded systolic blood pressure value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries alongside diastolic readings.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in hypertension monitoring displays and cardiovascular risk profiles.

## When Not to Use

- Do not use for entering new values -- use VitalSignBloodPressureSystolicAsMmhgInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for diastolic blood pressure display -- use VitalSignBloodPressureDiastolicAsMmhgView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for normal/abnormal ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-blood-pressure-systolic-as-mmhg-view` class for targeting. Common styling includes color coding for blood pressure categories (green for normal <120, yellow for elevated 120-129, orange for stage 1 hypertension 130-139, red for stage 2 hypertension >=140).

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "mmHg" as a unit label alongside the number. Use color coding to indicate blood pressure categories: normal (<120), elevated (120-129), stage 1 hypertension (130-139), stage 2 hypertension (>=140).
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "120 mmHg systolic"). Consider using `data-value` for conditional CSS styling based on category.

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

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- American Heart Association - Understanding Blood Pressure Readings: https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings
