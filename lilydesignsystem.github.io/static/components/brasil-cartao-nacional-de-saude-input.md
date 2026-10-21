# Brasil Cartao Nacional De Saude Input

BrasilCartaoNacionalDeSaudeInput is a headless input for entering Brazil's Cartão Nacional de Saúde (CNS), Brazil's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to BrasilCartaoNacionalDeSaudeView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to BrasilCartaoNacionalDeSaudeView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Cartão Nacional de Saúde (CNS)" required>
  <BrasilCartaoNacionalDeSaudeInput label="Cartão Nacional de Saúde (CNS)" value={value} required />
  <Hint>Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.</Hint>
  <ErrorMessage>Please enter a valid Cartão Nacional de Saúde</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Brazil's Cartão Nacional de Saúde (CNS).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `brasil-cartao-nacional-de-saude-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.brasil-cartao-nacional-de-saude-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.

**Where to find it:** Printed on the Cartão SUS (physical or digital health card) and required for any public health-system appointment, prescription, or vaccination record in Brazil.

## Related components

- `brasil-cartao-nacional-de-saude-view` — a read-only display of Brazil's Cartão Nacional de Saúde (CNS)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [CPF number (Cartão Nacional de Saúde)](https://en.wikipedia.org/wiki/CPF_number)

---

Lily™ and Lily Design System™ are trademarks.
