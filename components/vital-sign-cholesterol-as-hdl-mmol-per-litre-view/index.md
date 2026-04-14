# Vital Sign Cholesterol As HDL Mmol Per Litre View

VitalSignCholesterolAsHdlMmolPerLitreView is a headless read-only display of an HDL cholesterol value in millimoles per litre (mmol/L). It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's HDL ("good cholesterol") level in medical records, health dashboards, vital sign summaries, and wellness applications.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "1.5 mmol/L HDL cholesterol")
- The `value` prop is the HDL cholesterol in mmol/L with one decimal point
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignCholesterolAsHdlMmolPerLitreInput for the Input/View pattern

## Props

- `value`: number (required) -- HDL cholesterol value in mmol/L
- `label`: string (required) -- accessible description via `aria-label` (e.g., "1.5 mmol/L HDL cholesterol")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded HDL cholesterol value -->
<VitalSignCholesterolAsHdlMmolPerLitreView value={1.5} label="HDL cholesterol: 1.5 mmol/L" />

<!-- In a lipid panel summary alongside LDL -->
<VitalSignCholesterolAsHdlMmolPerLitreView value={1.3} label="HDL: 1.3 mmol/L" />
<VitalSignCholesterolAsLdlMmolPerLitreView value={2.8} label="LDL: 2.8 mmol/L" />

<!-- In a cardiovascular risk dashboard -->
<VitalSignCholesterolAsHdlMmolPerLitreView value={0.8} label="HDL cholesterol: 0.8 mmol/L - low" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded HDL cholesterol value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing lipid panels.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in cardiovascular risk profiles and health assessment reports.

## When Not to Use

- Do not use for entering new values -- use VitalSignCholesterolAsHdlMmolPerLitreInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for LDL cholesterol display -- use VitalSignCholesterolAsLdlMmolPerLitreView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for healthy/unhealthy ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-cholesterol-as-hdl-mmol-per-litre-view` class for targeting. Common styling includes color coding for ranges (green for healthy >1.0 mmol/L, red for low <1.0 mmol/L).

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "mmol/L" as a unit label alongside the number. Use color coding to indicate healthy (above 1.0 mmol/L) and low (below 1.0 mmol/L) ranges. Show one decimal place for precision.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "1.5 mmol/L HDL cholesterol"). Consider using `data-value` for conditional CSS styling based on range.

## Domain Knowledge

HDL (high-density lipoprotein) is known as "good cholesterol" because it helps remove other forms of cholesterol from the bloodstream. A healthy HDL level is above 1.0 mmol/L.

- Healthy Level: Above 1.0 mmol/L.
- Management: Regular exercise and smoking cessation can improve HDL levels. Increase intake of oily fish, nuts, seeds, fruits, vegetables, and whole grains.
- Avoid: High amounts of red meat, processed meats, full-fat dairy, and foods containing coconut or palm oil.
- Risk: Low HDL levels increase risk of heart disease and stroke.

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- NHS - High Cholesterol: https://www.nhs.uk/conditions/high-cholesterol/
