# VitalSignHeartRateAsBeatsPerMinuteView

VitalSignHeartRateAsBeatsPerMinuteView is a headless component that displays a read-only heart rate value in beats per minute. It renders a `<span>` element with `role="img"` and an accessible label for screen readers.

This component is useful for patient monitors, health dashboards, medical records, fitness applications, or any context that displays a heart rate reading. It is the display-only companion to VitalSignHeartRateAsBeatsPerMinuteInput.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for accessible presentation
- Uses `aria-label` for the full heart rate description for screen readers
- The `data-value` attribute enables consumer CSS styling based on the numeric value
- Spreads `restProps` onto the span for consumer customization (e.g., `id`, `data-testid`)
- Svelte 5 pattern: `$props()` for all props

## Props

- `value`: number (required) -- heart rate value in beats per minute
- `label`: string (required) -- accessible description via `aria-label`
- `class`: string (default: `""`) -- CSS class name
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```svelte
<VitalSignHeartRateAsBeatsPerMinuteView value={72} label="Heart rate: 72 beats per minute" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element
- `aria-label={label}` -- provides an accessible description of the heart rate

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
