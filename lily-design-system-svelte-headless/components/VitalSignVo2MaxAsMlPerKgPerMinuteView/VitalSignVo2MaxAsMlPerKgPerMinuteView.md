# VitalSignVO2MaxAsMlPerKgPerMinuteView

VitalSignVO2MaxAsMlPerKgPerMinuteView is a headless component that displays a read-only VO2 max value in ml/kg/min. It renders a `<span>` element with `role="img"` and an accessible label for screen readers.

This component is useful for patient monitors, health dashboards, medical records, fitness applications, or any context that displays a VO2 max reading. It is the display-only companion to VitalSignVO2MaxAsMlPerKgPerMinuteInput.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for accessible presentation
- Uses `aria-label` for the full VO2 max description for screen readers
- The `data-value` attribute enables consumer CSS styling based on the numeric value
- Spreads `restProps` onto the span for consumer customization (e.g., `id`, `data-testid`)
- Svelte 5 pattern: `$props()` for all props

## Props

- `value`: number (required) -- VO2 max value in ml/kg/min
- `label`: string (required) -- accessible description via `aria-label`
- `class`: string (default: `""`) -- CSS class name
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```svelte
<VitalSignVO2MaxAsMlPerKgPerMinuteView value={42} label="42 ml/kg/min VO2 max" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element
- `aria-label={label}` -- provides an accessible description of the VO2 max value

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
