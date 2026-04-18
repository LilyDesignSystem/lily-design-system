# MeasurementUnitInput

A measurement unit input provides a text field for entering a measurement unit, such as "kg", "lb", "cm", "inch", "F", or "C". A measurement unit is a standard quantity used to express a physical measurement.

The component uses `aria-label` for accessible labeling in a headless context, and the `value` prop is two-way bindable for reactive form integration. It supports `required` and `disabled` states for form validation and conditional interactivity.

## Implementation Notes

- Uses `<input type="text">` with `aria-label` for accessible naming
- A measurement unit is a standard quantity (e.g., "kg", "lb", "cm", "inch")
- Bindable `value` prop for two-way data binding via `$bindable()`
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

```svelte
<MeasurementUnitInput label="Unit" bind:value />
<MeasurementUnitInput label="Unit of measure" bind:value required />
```

## Keyboard Interactions

- Native `<input type="text">` keyboard behavior (typing, selection, clipboard-copy-button)

## ARIA

- `aria-label` -- set from the `label` prop to provide an accessible name
