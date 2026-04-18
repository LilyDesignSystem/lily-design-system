# VitalSignHeartRateVariabilityView

VitalSignHeartRateVariabilityView is a headless component that displays a read-only heart rate variability (HRV) value in milliseconds. It renders a `<span>` element with `role="img"` and an accessible label for screen readers.

This component is useful for patient monitors, health dashboards, medical records, fitness applications, or any context that displays a heart rate variability reading. It is the display-only companion to VitalSignHeartRateVariabilityInput.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for accessible presentation
- Uses `aria-label` for the full HRV description for screen readers
- The `data-value` attribute enables consumer CSS styling based on the numeric value
- Spreads `restProps` onto the span for consumer customization (e.g., `id`, `data-testid`)
- Svelte 5 pattern: `$props()` for all props

## Props

- `value`: number (required) -- heart rate variability value in milliseconds
- `label`: string (required) -- accessible description via `aria-label`
- `class`: string (default: `""`) -- CSS class name
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```svelte
<VitalSignHeartRateVariabilityView value={45} label="HRV: 45 milliseconds" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element
- `aria-label={label}` -- provides an accessible description of the heart rate variability

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
