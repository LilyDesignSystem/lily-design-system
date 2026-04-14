# Measurement System View

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

Display the current measurement system in a settings summary:

```html
<MeasurementSystemView value="metric" />
```

Display an abbreviated system with accessible label expansion:

```html
<MeasurementSystemView value="SI" label="International System of Units" />
```

Display imperial system in a patient profile:

```html
<MeasurementSystemView value="imperial" label="Imperial measurement system" />
```

## Keyboard Interactions

None -- this is a display-only component.

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed system name

## When to Use

- Use to display the current measurement system in read-only format.
- Use in detail views, reports, or dashboards where the system should be visible but not editable.
- Use alongside MeasurementInstanceView and MeasurementUnitView for complete measurement display.

## When Not to Use

- Do not use for selecting a system -- use MeasurementSystemInput instead.
- Do not use for displaying individual units -- use MeasurementUnitView instead.

## Headless

This headless component renders a `<span>` with the measurement system name as text content and optional `aria-label` for additional accessible context. The consumer provides all visual styling, including typography, abbreviation expansion, and layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.measurement-system-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `measurement-system-view`
- Verify aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed system name
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display system names consistently using either full names or abbreviations, and consider adding tooltips for abbreviated forms like "SI".
- **Developers**: Provide the `label` prop when displaying abbreviations (e.g., labeling "SI" as "International System of Units") for screen reader clarity.

## Composition

MeasurementSystemView is part of the measurement component family. It is the read-only counterpart to MeasurementSystemInput and works alongside MeasurementUnitView, MeasurementInstanceView, and their input counterparts.
