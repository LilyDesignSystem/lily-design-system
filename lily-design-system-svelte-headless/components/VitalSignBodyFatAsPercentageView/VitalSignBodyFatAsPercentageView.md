# VitalSignBodyFatAsPercentageView

VitalSignBodyFatAsPercentageView is a headless component that displays a read-only body fat percentage (BFP) value. It renders a `<span>` element with `role="img"` and an accessible label for screen readers.

This component is useful for patient monitors, health dashboards, medical records, fitness applications, clinical applications, or any context that displays a body fat percentage reading. It is the display-only companion to VitalSignBodyFatAsPercentageInput.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for accessible presentation
- Uses `aria-label` for the full body fat percentage description for screen readers
- The `data-value` attribute enables consumer CSS styling based on the numeric value
- Spreads `restProps` onto the span for consumer customization (e.g., `id`, `data-testid`)
- Svelte 5 pattern: `$props()` for all props

## Props

- `value`: number (required) -- body fat percentage value
- `label`: string (required) -- accessible description via `aria-label`
- `class`: string (default: `""`) -- CSS class name
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```svelte
<VitalSignBodyFatAsPercentageView value={22.5} label="22.5 percent body fat" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element
- `aria-label={label}` -- provides an accessible description of the body fat percentage

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
