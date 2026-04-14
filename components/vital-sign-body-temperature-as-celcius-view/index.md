# Vital Sign Body Temperature As Celcius View

VitalSignBodyTemperatureAsCelciusView is a headless read-only display of a body temperature value in degrees Celsius. It renders a `<span>` with `role="img"` and an accessible label describing the value and unit.

Use this component to display a patient's body temperature in medical records, health dashboards, vital sign summaries, and wellness applications.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for a read-only numeric display
- Uses `aria-label` for an accessible description (e.g., "37.0 degrees Celsius")
- The `value` prop is the temperature in degrees Celsius with one decimal point
- Spreads `restProps` onto the span for consumer customization
- Companion to VitalSignBodyTemperatureAsCelciusInput for the Input/View pattern

## Props

- `value`: number (required) -- body temperature value in degrees Celsius
- `label`: string (required) -- accessible description via `aria-label` (e.g., "37.0 degrees Celsius")
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```html
<!-- Display a recorded body temperature -->
<VitalSignBodyTemperatureAsCelciusView value={37.0} label="Body temperature: 37.0 °C" />

<!-- In a patient monitoring dashboard -->
<VitalSignBodyTemperatureAsCelciusView value={38.5} label="38.5 degrees Celsius - fever" />

<!-- In a vital signs summary -->
<VitalSignBodyTemperatureAsCelciusView value={36.4} label="Temperature: 36.4 °C - normal" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- identifies the span as a visual/graphic display element
- `aria-label={label}` -- provides the full value description for screen readers

## When to Use

- Use to display a recorded body temperature value in read-only format.
- Use in patient dashboards, medical records, or clinical summaries showing vital signs.
- Use with appropriate ARIA (`role="img"`, `aria-label`) for screen reader accessibility.
- Use in fever monitoring displays and post-operative recovery tracking.

## When Not to Use

- Do not use for entering new values -- use VitalSignBodyTemperatureAsCelciusInput instead.
- Do not use for general measurement display -- use MeasurementInstanceView for non-clinical values.
- Do not use for ambient temperature display -- this component is specifically for body temperature.

## Headless

This headless component provides a `<span>` with `role="img"` and `aria-label`. The consumer provides all visual styling including font size, color coding for normal/abnormal ranges, and unit label display.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-body-temperature-as-celcius-view` class for targeting. Common styling includes color coding for ranges (green for normal 36.1-37.2°C, red for fever ≥38.0°C or hypothermia ≤35.0°C).

## Testing

- Verify the component renders a `<span>` element with `role="img"`
- Verify `aria-label` is set from the `label` prop
- Verify the `value` is displayed as text content
- Verify `data-value` attribute is set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "°C" as a unit label alongside the number. Use color coding to indicate normal (36.1-37.2°C), low (≤35.0°C), and high (≥38.0°C) ranges. Show one decimal place for precision.
- **Developers**: The `label` prop should include both the value and unit for screen readers (e.g., "37.0 degrees Celsius"). Consider using `data-value` for conditional CSS styling based on range.

## Domain Knowledge

Normal adult body temperature averages 37.0°C, with a normal range from 36.1°C to 37.2°C.

- Fever: A temperature of 38.0°C or higher is generally considered a fever.
- Hypothermia: A temperature of 35.0°C or lower is considered hypothermia.
- Factors: Age (younger people tend to have higher, older adults lower), time of day (lowest in the morning, highest in the evening), and activity level all affect body temperature.
- Optimal Range: While 37.0°C is the commonly cited average, individual baselines vary. Many healthy adults have a resting temperature between 36.1°C and 37.2°C.

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
- MedlinePlus - Body Temperature Norms: https://medlineplus.gov/ency/article/001982.htm
