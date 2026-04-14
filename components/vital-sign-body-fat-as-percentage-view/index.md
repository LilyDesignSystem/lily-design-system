# Vital Sign Body Fat As Percentage View

VitalSignBodyFatAsPercentageView is a headless read-only display of a body fat percentage (BFP) value. It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's body fat percentage in medical records, health dashboards, vital sign summaries, fitness applications, and wellness assessments.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "22.5 percent body fat")
- The `value` prop is the body fat percentage with one decimal point
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignBodyFatAsPercentageInput for the Input/View pattern

## Props

- `value`: number (required) -- body fat percentage value
- `label`: string (required) -- accessible description via `aria-label` (e.g., "22.5 percent body fat")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded body fat percentage -->
<VitalSignBodyFatAsPercentageView value={22.5} label="Body fat: 22.5%" />

<!-- In a fitness dashboard -->
<VitalSignBodyFatAsPercentageView value={18.3} label="18.3 percent body fat - athlete range" />

<!-- In a health assessment report -->
<VitalSignBodyFatAsPercentageView value={30.0} label="Body fat percentage: 30.0%" class="borderline-range" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded body fat percentage value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing body composition.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in fitness tracking displays and metabolic health profiles.

## When Not to Use

- Do not use for entering new values -- use VitalSignBodyFatAsPercentageInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for weight display -- use VitalSignWeightAsKgView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for healthy/unhealthy ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-body-fat-as-percentage-view` class for targeting. Common styling includes displaying "%" as a suffix and color coding for ranges (green for healthy, yellow for borderline, red for unhealthy).

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "%" as a unit label alongside the number. Use color coding to indicate healthy ranges (typically below 25% for men, below 32% for women). Show one decimal place for precision.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "22.5 percent body fat"). Consider using `data-value` for conditional CSS styling based on range.

## Domain Knowledge

Body fat percentage (BFP) is a health marker that is more accurate than Body Mass Index (BMI) for predicting chronic disease risk, such as heart disease and type 2 diabetes. It assesses body composition, distinguishing fat from muscle, which is crucial for determining overall fitness, metabolic health, and risk for conditions like high blood pressure or insulin resistance.

- Superior to BMI: While Body Mass Index (BMI) is common, it is an imperfect measure that can misclassify muscular individuals as overweight. Body fat percentage offers a more direct, accurate assessment.
- Health Risks: High levels, particularly visceral fat, are linked to metabolic disorders, while excessively low levels can indicate poor nutrition or lack of protection for organs.
- Health Recommendations: Experts suggest healthy ranges are typically below 32% for women and 25% for men.
- Essential Fat: Women require approximately 10-13% essential fat; men require approximately 2-5%.
- Athletes: Female athletes typically range 14-20%; male athletes typically range 6-13%.

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- American Council on Exercise - Body Fat Percentages: https://www.acefitness.org/resources/everyone/tools-calculators/percent-body-fat-calculator/
