# VitalSignVo2MaxAsMlPerKgPerMinuteView

VitalSignVo2MaxAsMlPerKgPerMinuteView is a headless component that displays a read-only VO2 max value in ml/kg/min. It renders a `<span>` element with `role="img"` and an accessible label for screen readers.

This component is useful for patient dashboards, health records, fitness tracking interfaces, cardiorespiratory assessments, and any context where VO2 max data needs to be displayed as a read-only value.

## Implementation Notes

- Renders a `<span>` element with `role="img"`
- Uses `aria-label` for an accessible description of the VO2 max value
- The `data-value` attribute enables consumer CSS styling based on value
- Spreads `$attrs` onto the span for consumer customization (e.g., `id`, `data-testid`)

## Props

- `value`: number (required) -- VO2 max in ml/kg/min
- `label`: string (required) -- accessible description via `aria-label` (e.g., "42 ml/kg/min VO2 max")
- `...$attrs`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```vue
<VitalSignVo2MaxAsMlPerKgPerMinuteView :value="42" label="42 ml/kg/min VO2 max" />
```

## Keyboard Interactions

None. This is a passive, read-only display element.

## ARIA

- `role="img"` -- indicates the element represents a visual/graphic element
- `aria-label={label}` -- provides an accessible description of the VO2 max value

## References

- WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/
