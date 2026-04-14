# Vital Sign Body Temperature As Celcius Input

VitalSignBodyTemperatureAsCelciusInput is a headless number input for entering a body temperature value in degrees Celsius. It wraps a native `<input type="number">` with decimal-precision constraints and accessible labelling.

Use this component in medical forms, health assessments, vital sign entry screens, and wellness applications where users need to enter a body temperature measurement.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial undefined state
- Defaults: `min=30`, `max=45`, `step=0.1` for one-decimal-place Celsius entry
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization
- Companion to VitalSignBodyTemperatureAsCelciusView for the Input/View pattern

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | undefined (default: `undefined`) -- current temperature value in °C; bindable with two-way binding
- `min`: number (default: `30`) -- minimum allowed value
- `max`: number (default: `45`) -- maximum allowed value
- `step`: number (default: `0.1`) -- increment step size (one decimal place)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic temperature input in a clinical form -->
<VitalSignBodyTemperatureAsCelciusInput label="Body temperature (°C)" value={37.2} />

<!-- Required field in a triage assessment -->
<VitalSignBodyTemperatureAsCelciusInput label="Patient temperature" value={temp} required />

<!-- In a vital signs group entry -->
<VitalSignBodyTemperatureAsCelciusInput label="Temperature (°C)" value={temperature} min={34} max={42} />
```

## Keyboard Interactions

- Up Arrow: increment value by 0.1 (native browser behavior)
- Down Arrow: decrement value by 0.1 (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name describing the purpose of the temperature input

## When to Use

- Use in clinical forms to record a patient's body temperature measurement in degrees Celsius.
- Use with the default min/max/step constraints (30-45, step 0.1) for one-decimal-place Celsius entry.
- Use within vital sign entry workflows, triage forms, and fever screening assessments.
- Use in patient intake forms and post-operative monitoring.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignBodyTemperatureAsCelciusView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.

## Headless

This headless component wraps a native `<input type="number">` with `aria-label`, two-way bindable value, and temperature-appropriate defaults (min=30, max=45, step=0.1). The consumer provides all visual styling including input dimensions, borders, validation error display, and unit label.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-body-temperature-as-celcius-input` class for targeting. Common styling includes displaying "°C" as a suffix label and validation indicators for out-of-range values.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify default `min=30`, `max=45`, `step=0.1` attributes
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display "°C" as a unit label near the input. Use validation indicators to flag values outside the normal range (36.1-37.2°C). Provide placeholder text like "37.0" to hint at the expected format.
- **Developers**: Use the default min/max/step constraints for standard temperature entry. The step of 0.1 ensures one-decimal-place precision. Validate and display warnings for fever (≥38.0°C) or hypothermia (≤35.0°C) ranges on blur.

## Domain Knowledge

Normal adult body temperature averages 37.0°C, with a normal range from 36.1°C to 37.2°C.

- Fever: A temperature of 38.0°C or higher is generally considered a fever.
- Hypothermia: A temperature of 35.0°C or lower is considered hypothermia.
- Factors: Age (younger people tend to have higher, older adults lower), time of day (lowest in the morning, highest in the evening), and activity level all affect body temperature.
- Optimal Range: While 37.0°C is the commonly cited average, individual baselines vary. Many healthy adults have a resting temperature between 36.1°C and 37.2°C.

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
- MedlinePlus - Body Temperature Norms: https://medlineplus.gov/ency/article/001982.htm
