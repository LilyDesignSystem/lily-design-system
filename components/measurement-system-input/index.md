# Measurement System Input

A measurement system input provides a text field for entering a measurement system name, such as "metric", "imperial", or "SI". A measurement system is a collection of units and rules for measuring physical quantities.

The component uses `aria-label` for accessible labeling in a headless context, and the `value` prop is two-way bindable for reactive form integration. It supports `required` and `disabled` states for form validation and conditional interactivity.

## Implementation Notes

- Uses `<input type="text">` with `aria-label` for accessible naming
- A measurement system is a collection of units (e.g., "metric", "imperial", "SI")
- Bindable `value` prop for two-way data binding via two-way binding
- Supports `required` and `disabled` HTML attributes
- Spreads `...restProps` on the root `<input>` element
- All text content comes through props for internationalization

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: "", bindable) -- bindable measurement system name
- `required`: boolean (default: false) -- whether the field is required
- `disabled`: boolean (default: false) -- whether the field is disabled
- `...restProps`: Any additional HTML attributes passed to the `<input>` element

## Usage

Measurement system selection in a user preferences form:

```html
<MeasurementSystemInput label="Measurement system" value={system} />
```

Required measurement system in a clinical configuration:

```html
<MeasurementSystemInput label="System" value={system} required />
```

Disabled system input showing the current setting:

```html
<MeasurementSystemInput label="Measurement system" value="metric" disabled />
```

## Keyboard Interactions

- Native `<input type="text">` keyboard behavior (typing, selection, clipboard)

## ARIA

- `aria-label` -- set from the `label` prop to provide an accessible name

## When to Use

- Use for selecting a measurement system (metric, imperial, etc.).
- Use in settings or configuration forms where measurement system selection affects how values are interpreted.
- Use when the set of valid systems may vary or is not fully known at design time.

## When Not to Use

- Do not use for selecting individual units -- use MeasurementUnitInput instead.
- Do not use for display only -- use MeasurementSystemView instead.
- Do not use when the valid options are a fixed, known set -- consider Select or RadioGroup instead.

## Headless

This headless component provides a text input with `aria-label` for accessible naming and two-way bindable value for reactive form integration. The consumer provides all visual styling, including input dimensions, borders, and any autocomplete or suggestion UI.


## Styles

The consumer provides all CSS styling. The component renders with a `.measurement-system-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `measurement-system-input`
- Verify aria-label` -- set from the `label` prop to provide an accessible name
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: If the measurement system options are limited, consider pairing with a dropdown or autocomplete pattern for faster selection.
- **Developers**: Validate system names on the consumer side if only specific values are acceptable, as this component accepts free-text input.

## Composition

MeasurementSystemInput is part of the measurement component family. It works alongside MeasurementSystemView, MeasurementUnitInput, MeasurementUnitView, MeasurementInstanceInput, and MeasurementInstanceView.
