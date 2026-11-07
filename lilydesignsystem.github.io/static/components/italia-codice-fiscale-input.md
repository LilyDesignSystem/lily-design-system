# Italia Codice Fiscale Input

ItaliaCodiceFiscaleInput is a headless input for entering Italy's Codice fiscale (CF), Italy's tax/healthcare identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to ItaliaCodiceFiscaleView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

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
<Field
  label="Italian Fiscal Code"
  required
>
  <ItaliaCodiceFiscaleInput
    label="Italian Fiscal Code"
    value="{value}"
    required
  />
  <Hint
    >16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth
    and sex, 4 encoding place of birth, and 1 check character</Hint
  >
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

Sixteen-character alphanumeric code issued by the Agenzia delle Entrate, derived from surname (3 letters), given name (3 letters), date of birth and sex (5 alphanumeric characters with day +40 for women), place of birth (4-character Belfiore code), and a final check letter. Example: RSSMRA62B25E205Y.

**Where to find it:** Codice Fiscale paper card or Tessera Sanitaria (national health-service card), which carries the fiscal code on a magnetic stripe.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `italia-codice-fiscale-view` — a read-only display of Italy's Codice fiscale (CF)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Italian_fiscal_code

---

Lily™ and Lily Design System™ are trademarks.
