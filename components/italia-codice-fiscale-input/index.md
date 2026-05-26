# Italia Codice Fiscale Input

ItaliaCodiceFiscaleInput is a headless input for entering Italy's Codice fiscale (CF), Italy's tax/healthcare identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to ItaliaCodiceFiscaleView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to ItaliaCodiceFiscaleView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Italian Fiscal Code" required>
  <ItaliaCodiceFiscaleInput label="Italian Fiscal Code" value={value} required />
  <Hint>16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character</Hint>
  <ErrorMessage>Please enter a valid Italian Fiscal Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Italy's Codice fiscale (CF).
- Use with pattern validation matching the documented format.
- Use in administrative or tax/healthcare workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `italia-codice-fiscale-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.italia-codice-fiscale-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Codice fiscale (CF) is Italy's tax/healthcare identifier. Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character.

## Related components

- `italia-codice-fiscale-view` — a read-only display of Italy's Codice fiscale (CF)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Italian_fiscal_code
