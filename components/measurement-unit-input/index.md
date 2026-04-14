# Measurement Unit Input

A measurement unit input provides a text field for entering a measurement unit, such as "kg", "lb", "cm", "inch", "F", or "C". A measurement unit is a standard quantity used to express a physical measurement.

The component uses `aria-label` for accessible labeling in a headless context, and the `value` prop is two-way bindable for reactive form integration. It supports `required` and `disabled` states for form validation and conditional interactivity.

## Implementation Notes

- Uses `<input type="text">` with `aria-label` for accessible naming
- A measurement unit is a standard quantity (e.g., "kg", "lb", "cm", "inch")
- Bindable `value` prop for two-way data binding via two-way binding
- Supports `required` and `disabled` HTML attributes
- Spreads `...restProps` on the root `<input>` element
- All text content comes through props for internationalization

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: "", bindable) -- bindable measurement unit value
- `required`: boolean (default: false) -- whether the field is required
- `disabled`: boolean (default: false) -- whether the field is disabled
- `...restProps`: Any additional HTML attributes passed to the `<input>` element

## Usage

Unit selection alongside a numeric value input:

```html
<NumberInput label="Weight" value={weightValue} />
<MeasurementUnitInput label="Weight unit" value={weightUnit} />
```

Required unit input in a laboratory form:

```html
<MeasurementUnitInput label="Unit of measure" value={unit} required />
```

Disabled unit display in a read-only context:

```html
<MeasurementUnitInput label="Unit" value="kg" disabled />
```

## Keyboard Interactions

- Native `<input type="text">` keyboard behavior (typing, selection, clipboard)

## ARIA

- `aria-label` -- set from the `label` prop to provide an accessible name

## When to Use

- Use for selecting a specific measurement unit (kg, lbs, cm, inches, etc.).
- Use in forms where measurement units may vary and the user must specify which unit applies to a value.
- Use alongside MeasurementInstanceInput when value and unit are captured separately.

## When Not to Use

- Do not use for selecting the measurement system -- use MeasurementSystemInput instead.
- Do not use for display only -- use MeasurementUnitView instead.
- Do not use when the valid units are a fixed, known set -- consider Select or Combobox instead.

## Headless

This headless component provides a text input with `aria-label` for accessible naming and two-way bindable value for reactive form integration. The consumer provides all visual styling, including input dimensions, borders, and any unit-selection UI enhancements.


## Styles

The consumer provides all CSS styling. The component renders with a `.measurement-unit-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `measurement-unit-input`
- Verify aria-label` -- set from the `label` prop to provide an accessible name
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position the unit input adjacent to the corresponding value input so the relationship between value and unit is visually clear.
- **Developers**: Validate unit values on the consumer side if only specific units are acceptable, as this component accepts free-text input.

## Composition

MeasurementUnitInput is part of the measurement component family. It works alongside MeasurementUnitView, MeasurementInstanceInput, MeasurementInstanceView, MeasurementSystemInput, and MeasurementSystemView.
