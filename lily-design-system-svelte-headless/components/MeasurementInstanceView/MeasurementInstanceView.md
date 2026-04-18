# MeasurementInstanceView

A measurement instance view displays a specific measured value in a `<span>` element. A measurement instance is a concrete data point such as "72 kg", "98.6 F", or "120/80 mmHg". This component is part of the Input/View pattern for measurement data, providing a read-only display of measurement values.

The component supports an optional `aria-label` for additional accessible context, which is useful when the displayed value alone may not convey enough meaning to screen reader users (e.g., labeling "72 kg" as "Patient weight").

## Implementation Notes

- Renders as a `<span>` element displaying the measurement value as text content
- A measurement instance is a specific measured value (e.g., "72 kg", "98.6 F", "120/80 mmHg")
- Optional `label` prop maps to `aria-label` for additional accessible context
- Text content is inherently accessible to screen readers
- Spreads `...restProps` on the root `<span>` element for consumer customization
- No hardcoded user-facing strings; all text comes through props

## Props

- `value`: string (required) -- the measurement instance value to display
- `label`: string (optional) -- accessible name via aria-label for additional context

## Usage

```svelte
<MeasurementInstanceView value="72 kg" />
<MeasurementInstanceView value="98.6 F" label="Body temperature" />
```

## Keyboard Interactions

None -- this is a display-only component.

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed value
