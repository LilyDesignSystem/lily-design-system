# Vital Sign Heart Rate Variability View

VitalSignHeartRateVariabilityView is a headless read-only display of a heart rate variability (HRV) value in milliseconds. It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's heart rate variability in medical records, health dashboards, vital sign summaries, fitness applications, and wellness assessments.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "45 milliseconds HRV")
- The `value` prop is the integer HRV in milliseconds
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignHeartRateVariabilityInput for the Input/View pattern

## Props

- `value`: number (required) -- heart rate variability value in milliseconds
- `label`: string (required) -- accessible description via `aria-label` (e.g., "45 milliseconds HRV")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded HRV value -->
<VitalSignHeartRateVariabilityView value={45} label="Heart rate variability: 45 ms" />

<!-- In a wellness dashboard -->
<VitalSignHeartRateVariabilityView value={68} label="HRV: 68 ms - above your average" />

<!-- Alongside heart rate in a recovery summary -->
<VitalSignHeartRateAsBeatsPerMinuteView value={62} label="Heart rate: 62 BPM" />
<VitalSignHeartRateVariabilityView value={52} label="HRV: 52 ms" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded heart rate variability value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing autonomic health.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in wellness tracking displays, stress monitoring, and recovery summaries.

## When Not to Use

- Do not use for entering new values -- use VitalSignHeartRateVariabilityInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for heart rate display -- use VitalSignHeartRateAsBeatsPerMinuteView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-heart-rate-variability-view` class for targeting. Common styling includes displaying "ms" as a suffix and color coding for relative ranges.

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "ms" as a unit label alongside the number. Since HRV varies widely by individual, avoid using absolute color thresholds. Consider showing trend arrows or context like "above your average" instead.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "45 milliseconds HRV"). Consider using `data-value` for conditional CSS styling. Focus on displaying personal trends rather than absolute ranges.

## Domain Knowledge

Heart Rate Variability (HRV) measures the subtle fluctuation in time between consecutive heartbeats, serving as a key indicator of autonomic nervous system health, stress levels, and recovery. A higher, more flexible HRV generally indicates better cardiovascular fitness and resilience, while lower, more rigid values can signal stress, illness, or fatigue.

- Physiological Basis: HRV reflects the balance between the sympathetic ("fight-or-flight") and parasympathetic ("rest-and-digest") nervous systems.
- Typical Ranges: Normal HRV varies widely by individual, typically ranging from below 20 to over 200 milliseconds, and decreases with age.
- Tracking Metrics: Wearables (e.g., Oura, Whoop, Garmin) often use RMSSD (root mean squared of successive differences) to measure HRV, usually while sleeping for the most accurate data.
- Improving HRV: Consistent positive lifestyle habits such as adequate sleep, regular exercise, reduced alcohol consumption, and stress management can increase HRV.
- Decreases: High stress, illness, fatigue, alcohol, dehydration, and increasing age.
- Increases: Good cardiovascular fitness, proper recovery, and positive emotional states.
- Individual Focus: It is important to focus on personal trends over time rather than comparing absolute numbers with others, as individual baselines differ significantly.

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- Harvard Health - Heart Rate Variability: https://www.health.harvard.edu/blog/heart-rate-variability-new-way-track-well-2017112212789
