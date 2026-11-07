# Uruguay Cedula De Identidad Input

UruguayCedulaDeIdentidadInput is a headless input for entering Uruguay's Cedula de Identidad Number, Uruguay's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to UruguayCedulaDeIdentidadView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to UruguayCedulaDeIdentidadView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Cedula de Identidad Number"
  required
>
  <UruguayCedulaDeIdentidadInput
    label="Cedula de Identidad Number"
    value="{value}"
    required
  />
  <Hint
    >Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded
    with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check
    digit is the amount that brings the sum to the next multiple of 10 (0 when it already is
    one).</Hint
  >
  <ErrorMessage>Please enter a valid Cedula de Identidad Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Uruguay's Cedula de Identidad Number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `uruguay-cedula-de-identidad-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.uruguay-cedula-de-identidad-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).

**Where to find it:** Printed on the Cédula de Identidad issued by the Dirección Nacional de Identificación Civil, and asked for by health providers (ASSE and mutualistas), banks and government services.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `uruguay-cedula-de-identidad-view` — a read-only display of Uruguay's Cedula de Identidad Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Cédula de identidad](https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad)

---

Lily™ and Lily Design System™ are trademarks.
