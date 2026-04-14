# Measurement Instance View

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

Display a patient weight reading:

```html
<MeasurementInstanceView value="72 kg" label="Patient weight" />
```

Display a body temperature in a clinical summary:

```html
<MeasurementInstanceView value="98.6 F" label="Body temperature" />
```

Display a blood pressure reading:

```html
<MeasurementInstanceView value="120/80 mmHg" label="Blood pressure" />
```

## Keyboard Interactions

None -- this is a display-only component.

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed value

## When to Use

- Use to display a measurement value and unit in read-only format.
- Use in dashboards, reports, or detail views where the measurement should be visible but not editable.
- Use when displaying recorded values such as "72 kg", "98.6 F", or "120/80 mmHg".

## When Not to Use

- Do not use for entering measurements -- use MeasurementInstanceInput instead.
- Do not use for vital sign-specific displays -- use the corresponding VitalSign*View component instead.

## Headless

This headless component renders a `<span>` with the measurement value as text content and optional `aria-label` for additional accessible context. The consumer provides all visual styling, including typography, color coding based on value ranges, and spacing.


## Styles

The consumer provides all CSS styling. The component renders with a `.measurement-instance-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `measurement-instance-view`
- Verify aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed value
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use consistent formatting and alignment for measurement values so users can quickly scan and compare readings across a page.
- **Developers**: Provide the `label` prop when the displayed value alone may be ambiguous to screen reader users, such as labeling "72 kg" as "Patient weight".

## Composition

MeasurementInstanceView is part of the measurement component family. It is the read-only counterpart to MeasurementInstanceInput and works alongside MeasurementUnitView, MeasurementSystemView, and their input counterparts.
