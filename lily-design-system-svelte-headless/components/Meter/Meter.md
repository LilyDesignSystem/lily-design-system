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
- Svelte 5 pattern: standard `$props()` destructuring with typed props

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

```svelte
<Meter label="Disk space" value={45} max={100} />
```

## Keyboard Interactions

None -- this component is a passive display element with no interactive behavior.

## ARIA

- `aria-label={label}` -- provides an accessible name describing what the meter measures

## References

- HTML meter element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter
- WAI-ARIA meter role: https://www.w3.org/TR/wai-aria-1.2/#meter
