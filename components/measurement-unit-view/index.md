# Measurement Unit View

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

Display a unit alongside a measurement value:

```html
<MeasurementInstanceView value="72" />
<MeasurementUnitView value="kg" label="Kilograms" />
```

Display an abbreviated unit with accessible label:

```html
<MeasurementUnitView value="lb" label="Pounds" />
```

Display a unit in a clinical summary:

```html
<MeasurementUnitView value="mmHg" label="Millimetres of mercury" />
```

## Keyboard Interactions

None -- this is a display-only component.

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed unit abbreviation

## When to Use

- Use to display a measurement unit in read-only format.
- Use alongside MeasurementInstanceView to show the unit separately from the value.
- Use in dashboards, reports, or detail views where the unit should be visible but not editable.

## When Not to Use

- Do not use for selecting a unit -- use MeasurementUnitInput instead.
- Do not use for displaying the measurement system -- use MeasurementSystemView instead.

## Headless

This headless component renders a `<span>` with the measurement unit as text content and optional `aria-label` for additional accessible context. The consumer provides all visual styling, including typography, positioning relative to the value, and any abbreviation expansion.


## Styles

The consumer provides all CSS styling. The component renders with a `.measurement-unit-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `measurement-unit-view`
- Verify aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed unit abbreviation
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display units in a consistent style (e.g., smaller font size or muted color) positioned immediately after their corresponding values.
- **Developers**: Provide the `label` prop when displaying abbreviated units (e.g., labeling "lb" as "Pounds") so screen reader users understand the full meaning.

## Composition

MeasurementUnitView is part of the measurement component family. It is the read-only counterpart to MeasurementUnitInput and works alongside MeasurementInstanceView, MeasurementSystemView, and their input counterparts.
