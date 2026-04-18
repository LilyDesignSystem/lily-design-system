# MeasurementSystemView

A measurement system view displays a measurement system name in a `<span>` element. A measurement system is a collection of units and rules for measuring, such as "metric", "imperial", or "SI" (International System of Units). This component is part of the Input/View pattern for measurement data, providing a read-only display of measurement system names.

The component supports an optional `aria-label` for additional accessible context, which is useful when the abbreviated system name alone may not convey enough meaning (e.g., labeling "SI" as "International System of Units").

## Implementation Notes

- Renders as a `<span>` element displaying the measurement system name as text content
- A measurement system is a collection of units and rules (e.g., "metric", "imperial", "SI")
- Optional `label` prop maps to `aria-label` for additional accessible context
- Text content is inherently accessible to screen readers
- Spreads `...restProps` on the root `<span>` element for consumer customization
- No hardcoded user-facing strings; all text comes through props

## Props

- `value`: string (required) -- the measurement system name to display
- `label`: string (optional) -- accessible name via aria-label for additional context

## Usage

```svelte
<MeasurementSystemView value="metric" />
<MeasurementSystemView value="SI" label="International System" />
```

## Keyboard Interactions

None -- this is a display-only component.

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed system name
