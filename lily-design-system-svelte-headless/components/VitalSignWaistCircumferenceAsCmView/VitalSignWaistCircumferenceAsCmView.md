# VitalSignWaistCircumferenceAsCmView

VitalSignWaistCircumferenceAsCmView is a headless component that displays a read-only waist circumference value in centimeters. It renders a `<span>` element with `role="img"` and an accessible label for screen readers.

This component is useful for patient monitors, health dashboards, medical records, fitness applications, or any context that displays a waist circumference reading. It is the display-only companion to VitalSignWaistCircumferenceAsCmInput.

## Implementation Notes

- Renders a `<span>` element with `role="img"` for accessible presentation
- Uses `aria-label` for the full waist circumference description for screen readers
- The `data-value` attribute enables consumer CSS styling based on the numeric value
- Spreads `restProps` onto the span for consumer customization (e.g., `id`, `data-testid`)
- Svelte 5 pattern: `$props()` for all props

## Props

- `value`: number (required) -- waist circumference value in centimeters
- `label`: string (required) -- accessible description via `aria-label`
- `class`: string (default: `""`) -- CSS class name
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```svelte
<VitalSignWaistCircumferenceAsCmView value={94} label="94 cm waist circumference" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element
- `aria-label={label}` -- provides an accessible description of the waist circumference

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
