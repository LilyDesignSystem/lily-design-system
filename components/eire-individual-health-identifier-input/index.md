# Eire Individual Health Identifier Input

EireIndividualHealthIdentifierInput is a headless input for entering an Eire Individual Health Identifier (IHI), the unique national healthcare identifier used by the HSE. It renders as `<input type="text">` with a 10-digit pattern, numeric keyboard hint, and autocomplete disabled. It is the editable companion to EireIndividualHealthIdentifierView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<input type="text">` with pattern `[0-9]{10}`
- `inputmode="numeric"` for mobile numeric keyboard
- `autocomplete="off"` to protect sensitive health identifiers
- Supports two-way binding on the `value` prop
- Companion to EireIndividualHealthIdentifierView

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: any -- additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Individual Health Identifier" required>
  <EireIndividualHealthIdentifierInput label="IHI" value={ihi} required />
  <Hint>Enter the 10-digit IHI from your HSE records</Hint>
  <ErrorMessage>Please enter a valid 10-digit IHI</ErrorMessage>
</Field>
```

## Keyboard Interactions

- Standard text input keyboard behavior
- Users type 10 digits

## ARIA

- `aria-label={label}` -- provides accessible name

## When to Use

- Use in clinical or administrative forms to collect an Eire Individual Health Identifier (IHI).
- Use with validation for the 10-digit IHI format.
- Use in patient registration workflows where the IHI is required by HSE systems.

## When Not to Use

- Do not use for displaying read-only identifiers -- use EireIndividualHealthIdentifierView instead.
- Do not use for general text input -- use TextInput instead.
- Do not use for other national identifiers -- use the corresponding country-specific input component.

## Headless

This headless component provides a bare `<input type="text">` with `aria-label`, pattern, `inputmode="numeric"`, and `autocomplete="off"`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.eire-individual-health-identifier-input` class for targeting.

## Testing

- Verify renders an `<input>` with the correct class and type="text"
- Verify `aria-label` is set from the label prop
- Verify pattern `[0-9]{10}`, `inputmode="numeric"`, `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten-digit lifelong identifier created under the 2014 Health Identifiers Act and operated by the Health Service Executive (HSE) to uniquely identify every person using a health or social care service in Eire. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** HSE correspondence, hospital and GP appointment letters, the National Shared Care Record, and patient-facing portals.

## Related components

- `eire-individual-health-identifier-view` — a read-only display of Eire Individual Health Identifier (IHI) unique national healthcare identifier
- `text-input` — a single-line text input field <input type="text">

## References

- HSE: https://www.hse.ie/

---

Lily™ and Lily Design System™ are trademarks.
