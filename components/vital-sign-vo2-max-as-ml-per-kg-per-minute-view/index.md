# Vital Sign VO2 Max As Ml Per Kg Per Minute View

VitalSignVO2MaxMlPerKgPerMinuteView is a headless read-only display of a VO2 max value in milliliters of oxygen per kilogram of body mass per minute (ml/kg/min). It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's VO2 max in medical records, health dashboards, vital sign summaries, fitness applications, and wellness assessments.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "42 ml/kg/min VO2 max")
- The `value` prop is the integer VO2 max in ml/kg/min
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignVO2MaxMlPerKgPerMinuteInput for the Input/View pattern

## Props

- `value`: number (required) -- VO2 max value in ml/kg/min
- `label`: string (required) -- accessible description via `aria-label` (e.g., "42 ml/kg/min VO2 max")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded VO2 max value -->
<VitalSignVo2MaxAsMlPerKgPerMinuteView value={42} label="VO2 max: 42 ml/kg/min" />

<!-- In a fitness dashboard -->
<VitalSignVo2MaxAsMlPerKgPerMinuteView value={55} label="VO2 max: 55 ml/kg/min - excellent" />

<!-- In a cardiovascular fitness summary -->
<VitalSignHeartRateAsBeatsPerMinuteView value={58} label="Resting heart rate: 58 BPM" />
<VitalSignVo2MaxAsMlPerKgPerMinuteView value={48} label="VO2 max: 48 ml/kg/min - good" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded VO2 max value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing cardiovascular fitness.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in fitness tracking displays and sports medicine summaries.

## When Not to Use

- Do not use for entering new values -- use VitalSignVo2MaxAsMlPerKgPerMinuteInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for heart rate display -- use VitalSignHeartRateAsBeatsPerMinuteView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for fitness levels, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-vo2-max-as-ml-per-kg-per-minute-view` class for targeting. Common styling includes displaying "ml/kg/min" as a suffix and color coding for fitness categories.

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "ml/kg/min" as a unit label alongside the number. Use color coding to indicate fitness categories (e.g., excellent, good, average, poor). Higher numbers indicate better cardiovascular fitness.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "42 ml/kg/min VO2 max"). Consider using `data-value` for conditional CSS styling based on fitness category.

## Domain Knowledge

VO2 max represents the maximum oxygen your body can use during exercise, measured in milliliters of oxygen per kilogram of body weight per minute (ml/kg/min). Higher numbers indicate better cardiovascular fitness.

- Lab-Based Testing (Gold Standard): Exercise on a treadmill or stationary bike with increasing intensity while wearing a face mask that measures gas exchange. Provides direct measurement of maximal oxygen consumption.
- Wearable Devices (Estimation): Garmin, Apple Watch, and other fitness trackers estimate VO2 max based on heart rate and GPS data during runs or brisk walks. Not as precise as lab tests but useful for tracking progress.
- Field Tests (DIY Estimation): Cooper Test (12-minute run) or Rockport Walking Test provide estimated calculations based on distance, time, and heart rate.
- Interpretation: Higher numbers indicate better cardiovascular fitness. Values vary by age, sex, and fitness level.
- Best Time to Test: Perform tests when well-rested for accurate, high-effort measurement. Avoid strenuous exercise for 24-36 hours prior and stay hydrated.

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- American College of Sports Medicine - VO2 Max: https://www.acsm.org/
