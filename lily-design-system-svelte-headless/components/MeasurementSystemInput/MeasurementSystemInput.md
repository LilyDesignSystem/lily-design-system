# MeasurementSystemInput

A measurement system input provides a text field for entering a measurement system name, such as "metric", "imperial", or "SI". A measurement system is a collection of units and rules for measuring physical quantities.

The component uses `aria-label` for accessible labeling in a headless context, and the `value` prop is two-way bindable for reactive form integration. It supports `required` and `disabled` states for form validation and conditional interactivity.

## Implementation Notes

- Uses `<input type="text">` with `aria-label` for accessible naming
- A measurement system is a collection of units (e.g., "metric", "imperial", "SI")
- Bindable `value` prop for two-way data binding via `$bindable()`
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

```svelte
<MeasurementSystemInput label="Measurement system" bind:value />
<MeasurementSystemInput label="System" bind:value required />
```

## Keyboard Interactions

- Native `<input type="text">` keyboard behavior (typing, selection, clipboard-copy-button)

## ARIA

- `aria-label` -- set from the `label` prop to provide an accessible name
