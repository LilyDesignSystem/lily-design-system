# Vital Sign Belly Circumference As Cm View

VitalSignBellyCircumferenceAsCmView is a read-only display of a belly circumference value in centimetres. It renders the numeric value as text content inside a `<span>` with `role="img"` and `aria-label` for accessibility. It is the display-only companion to VitalSignBellyCircumferenceAsCmInput.

This component is useful for patient monitors, health dashboards, medical records, and fitness applications where belly circumference readings need to be displayed.

## Implementation Notes

- Renders a `<span>` with `role="img"`, `aria-label`, and `data-value`
- Displays the value as text content
- Companion to VitalSignBellyCircumferenceAsCmInput for the Input/View pattern

## Props

- `value`: number (required) -- belly circumference value in centimetres
- `label`: string (required) -- accessible description via `aria-label`
- `...restProps`: unknown -- additional attributes spread onto the `<span>`

## Usage

```html
<!-- Display a recorded belly circumference -->
<VitalSignBellyCircumferenceAsCmView value={90} label="Belly circumference: 90 cm" />

<!-- In a patient dashboard alongside other vital signs -->
<VitalSignBellyCircumferenceAsCmView value={102} label="102 cm belly circumference" />

<!-- With custom styling for risk thresholds -->
<VitalSignBellyCircumferenceAsCmView value={85} label="Belly circumference: 85 cm" class="normal-range" />
```

## Keyboard Interactions

- None (passive, read-only display element)

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element
- `aria-label={label}` -- provides full belly circumference description for screen readers

## When to Use

- Use to display a recorded belly circumference value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing body measurements.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in health assessment reports and metabolic risk profiles.

## When Not to Use

- Do not use for entering new values -- use VitalSignBellyCircumferenceAsCmInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for waist circumference -- use VitalSignWaistCircumferenceAsCmView instead.

## Headless

This headless component provides a `<span>` with `role="img"`, `aria-label`, and `data-value`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-belly-circumference-as-cm-view` class for targeting.

## Testing

- Verify renders a `<span>` with class `vital-sign-belly-circumference-as-cm-view`
- Verify `role="img"` and `aria-label` are set
- Verify `data-value` matches the value prop
- Verify value is displayed as text content

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
