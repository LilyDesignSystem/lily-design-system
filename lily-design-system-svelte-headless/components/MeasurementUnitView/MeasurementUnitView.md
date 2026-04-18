# MeasurementUnitView

A measurement unit view displays a measurement unit in a `<span>` element. A measurement unit is a standard quantity used to express a measurement, such as "kg", "lb", "cm", or "inch". This component is part of the Input/View pattern for measurement data, providing a read-only display of unit abbreviations or names.

The component supports an optional `aria-label` for additional accessible context, which is useful when abbreviated units may not be clear to screen reader users (e.g., labeling "lb" as "Pounds").

## Implementation Notes

- Renders as a `<span>` element displaying the measurement unit as text content
- A measurement unit is a standard quantity for expressing measurements (e.g., "kg", "lb", "cm", "inch")
- Optional `label` prop maps to `aria-label` for additional accessible context
- Text content is inherently accessible to screen readers
- Spreads `...restProps` on the root `<span>` element for consumer customization
- No hardcoded user-facing strings; all text comes through props

## Props

- `value`: string (required) -- the measurement unit to display
- `label`: string (optional) -- accessible name via aria-label for additional context

## Usage

```svelte
<MeasurementUnitView value="kg" />
<MeasurementUnitView value="lb" label="Pounds" />
```

## Keyboard Interactions

None -- this is a display-only component.

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed unit abbreviation
