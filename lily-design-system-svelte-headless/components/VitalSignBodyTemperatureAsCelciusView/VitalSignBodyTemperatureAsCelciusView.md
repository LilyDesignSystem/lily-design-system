# VitalSignBodyTemperatureAsCelciusView

VitalSignBodyTemperatureAsCelciusView is a headless component that displays a read-only body temperature value in degrees Celsius. It renders a `<span>` element with `role="img"` and an accessible label for screen readers.

This component is useful for patient monitors, health dashboards, medical records, clinical applications, or any context that displays a body temperature reading. It is the display-only companion to VitalSignBodyTemperatureAsCelciusInput.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for accessible presentation
- Uses `aria-label` for the full body temperature description for screen readers
- The `data-value` attribute enables consumer CSS styling based on the numeric value
- Spreads `restProps` onto the span for consumer customization (e.g., `id`, `data-testid`)
- Svelte 5 pattern: `$props()` for all props

## Props

- `value`: number (required) -- body temperature value in degrees Celsius
- `label`: string (required) -- accessible description via `aria-label`
- `class`: string (default: `""`) -- CSS class name
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```svelte
<VitalSignBodyTemperatureAsCelciusView value={37.0} label="Body temperature: 37.0 degrees Celsius" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element
- `aria-label={label}` -- provides an accessible description of the body temperature

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
