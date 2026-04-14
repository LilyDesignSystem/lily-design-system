# Meter

Meter is a headless component that displays a scalar measurement within a known range using the native HTML `<meter>` element. It provides accessible labelling and supports optional threshold indicators for low, high, and optimum values.

This component is useful for displaying disk usage, battery level, password strength, performance scores, or any bounded numeric measurement. The native `<meter>` element provides built-in semantics that assistive technologies can interpret, and the text content inside the element serves as a fallback for browsers that do not support the element.

## Implementation Notes

- Renders a native `<meter>` element with the value displayed as fallback text content
- Uses `aria-label` for an accessible name describing what the meter measures
- Supports the full set of `<meter>` attributes: `value`, `min`, `max`, `low`, `high`, `optimum`
- The `min` and `max` props default to 0 and 100 respectively
- `low`, `high`, and `optimum` are optional and default to undefined
- Spreads `restProps` onto the meter for consumer customization
- pattern: standard props destructuring with typed props

## Props

- `value`: number (required) -- the current measured value
- `min`: number (default: `0`) -- the minimum bound of the range
- `max`: number (default: `100`) -- the maximum bound of the range
- `low`: number (optional) -- the upper bound of the low range threshold
- `high`: number (optional) -- the lower bound of the high range threshold
- `optimum`: number (optional) -- the optimal value within the range
- `label`: string (required) -- accessible name for the meter via `aria-label`
- `...restProps`: unknown -- additional attributes spread onto the `<meter>` element

## Usage

Disk usage gauge with thresholds:

```html
<Meter label="Disk space used" value={72} max={100} low={25} high={75} optimum={50} />
```

Battery level indicator:

```html
<Meter label="Battery level" value={35} min={0} max={100} low={20} high={80} optimum={100} />
```

Password strength meter:

```html
<Meter label="Password strength" value={3} min={0} max={5} low={1} high={4} optimum={5} />
```

## Keyboard Interactions

None -- this component is a passive display element with no interactive behavior.

## ARIA

- `aria-label={label}` -- provides an accessible name describing what the meter measures

## When to Use

- Use Meter to display a scalar measurement within a known range, such as disk usage, battery level, or password strength.
- Use Meter when the value has defined minimum and maximum bounds and optionally low, high, and optimum thresholds.
- Use Meter for compliance scores, performance ratings, or capacity indicators that represent a fixed-point measurement.
- Use Meter for displaying signal strength, sound volume, or any bounded numeric gauge.

## When Not to Use

- Do not use Meter for task completion or ongoing progress -- use Progress instead.
- Do not use Meter for indeterminate values where the range is unknown -- the range must be defined.
- Do not use Meter for interactive controls where the user adjusts the value -- use RangeInput or Slider instead.

## Headless

This headless component renders a native `<meter>` element with `aria-label`, supporting `min`, `max`, `low`, `high`, and `optimum` attributes for threshold semantics. The consumer provides all visual styling, including gauge colors, threshold color changes, size, and layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.meter` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<meter>` element with class `meter`
- Verify aria-label={label}` -- provides an accessible name describing what the meter measures
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use color to indicate threshold regions (e.g., green for optimum, yellow for warning, red for critical) and always include a visible text label near the meter.
- **Developers**: Set `low`, `high`, and `optimum` props to leverage the browser's built-in color hinting for the `<meter>` element. Provide a meaningful `label` for screen readers.

## References

- HTML meter element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter
- WAI-ARIA meter role: https://www.w3.org/TR/wai-aria-1.2/#meter
