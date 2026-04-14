# Vital Sign Respiratory Rate As Breaths Per Minute View

VitalSignRespiratoryRateAsBreathsPerMinuteView is a headless read-only display of a respiratory rate value in breaths per minute (bpm). It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's respiratory rate in medical records, health dashboards, vital sign summaries, and wellness applications.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "16 breaths per minute")
- The `value` prop is the integer respiratory rate in breaths per minute
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignRespiratoryRateAsBreathsPerMinuteInput for the Input/View pattern

## Props

- `value`: number (required) -- respiratory rate value in breaths per minute
- `label`: string (required) -- accessible description via `aria-label` (e.g., "16 breaths per minute")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded respiratory rate -->
<VitalSignRespiratoryRateAsBreathsPerMinuteView value={16} label="Respiratory rate: 16 breaths/min" />

<!-- In a patient monitoring dashboard -->
<VitalSignRespiratoryRateAsBreathsPerMinuteView value={24} label="24 breaths per minute - tachypnea" />

<!-- In a vital signs summary -->
<VitalSignRespiratoryRateAsBreathsPerMinuteView value={14} label="Respiratory rate: 14 breaths/min - normal" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded respiratory rate value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing vital signs.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in respiratory monitoring displays and post-operative care summaries.

## When Not to Use

- Do not use for entering new values -- use VitalSignRespiratoryRateAsBreathsPerMinuteInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for heart rate display -- use VitalSignHeartRateAsBeatsPerMinuteView instead.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for normal/abnormal ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-respiratory-rate-as-breaths-per-minute-view` class for targeting. Common styling includes color coding for ranges (green for normal 12-20 bpm, red for bradypnea <12 or tachypnea >20).

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "bpm" as a unit label alongside the number. Use color coding to indicate normal (12-20 bpm), low (<12 bpm), and high (>20 bpm) ranges.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "16 breaths per minute"). Consider using `data-value` for conditional CSS styling based on range.

## Domain Knowledge

A normal adult respiratory rate at rest is 12-20 breaths per minute (bpm), with rates under 12 or over 25 considered abnormal. As a key vital sign, it measures breaths per minute (inhalation and exhalation) to assess oxygenation and potential underlying illness.

- Normal Adult Range: 12-20 bpm. Some sources suggest a tighter 12-18 or 12-16 bpm range for optimal health.
- Abnormalities: Tachypnea is fast, shallow breathing (often >20-28 bpm in adults). Bradypnea is slow breathing (often <12 bpm).
- Normal Pediatric Ranges: Newborns: 30-60 bpm. 1 year old: 24-40 bpm. 3 years old: 20-30 bpm. 6 years old: 18-25 bpm. 10 years old: 17-23 bpm.
- Clinical Significance: A rate higher than 27 breaths per minute is a strong predictor of potential cardiac arrest in hospital settings.
- Factors: Exercise, anxiety, stress, fever, illness, and altitude can increase the respiratory rate.
- Measurement: Count the number of times the chest rises or falls in one full minute.

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- MedlinePlus - Breathing Rate: https://medlineplus.gov/ency/article/002020.htm
