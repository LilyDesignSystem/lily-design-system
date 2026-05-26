# Hrvatska Osobni Identifikacijski Broj Input

HrvatskaOsobniIdentifikacijskiBrojInput is a headless input for entering Croatia's Osobni identifikacijski broj (OIB), Croatia's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to HrvatskaOsobniIdentifikacijskiBrojView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to HrvatskaOsobniIdentifikacijskiBrojView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Personal Identification Number" required>
  <HrvatskaOsobniIdentifikacijskiBrojInput label="Personal Identification Number" value={value} required />
  <Hint>11 digits — 10 random digits plus a check digit</Hint>
  <ErrorMessage>Please enter a valid Personal Identification Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Croatia's Osobni identifikacijski broj (OIB).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `hrvatska-osobni-identifikacijski-broj-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.hrvatska-osobni-identifikacijski-broj-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Osobni identifikacijski broj (OIB) is Croatia's national-id identifier. Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.

## Related components

- `hrvatska-osobni-identifikacijski-broj-view` — a read-only display of Croatia's Osobni identifikacijski broj (OIB)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)
