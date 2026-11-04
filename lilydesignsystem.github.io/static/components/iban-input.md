# IBAN Input

IbanInput is a headless input for entering an International Bank Account Number (IBAN), used for bank accounts in many countries. It renders as `<input type="text">` with pattern validation, letter/digit keyboard hints, and `autocomplete="off"` to protect sensitive account numbers. It is the editable companion to IbanView.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: Up to 34 letters and digits: a two-letter country code, two check digits, then the national account number
- `autocomplete="off"` to protect sensitive account numbers
- Supports two-way binding on the `value` prop
- Companion to IbanView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="IBAN"
  required
>
  <IbanInput
    label="IBAN"
    value="{value}"
    required
  />
  <Hint
    >Up to 34 letters and digits: a two-letter country code, two check digits, then the national
    account number</Hint
  >
  <ErrorMessage>Please enter a valid IBAN</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting an International Bank Account Number (IBAN).
- Use with pattern validation matching the documented format.
- Use in payment, payroll and refund workflows where the account number is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `iban-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use where the country has no IBAN, such as the United States, Canada or Australia: use `text-input` with that country's own account format.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.iban-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The International Bank Account Number is defined by ISO 13616, with SWIFT as its registrar. It has up to 34 letters and digits: a two-letter ISO 3166-1 country code, two check digits, then the Basic Bank Account Number, whose length and format each country sets. Print it in groups of four, as in `GB82 WEST 1234 5698 7654 32`; store and send it with no spaces.

**Check digits.** ISO 7064 Mod 97-10: remove spaces, move the first four characters to the end, replace each letter with two digits (A = 10 to Z = 35), and the whole number modulo 97 must equal 1. A pass shows the number is well formed, not that the account exists. This component ships no validation; the consumer runs the check.

**Where it is used.** Across Europe and in many countries of the Middle East, Africa and Latin America. It is not universal: the United States, Canada, Australia and China, among others, do not use it. Offer such users their own account format.

**Where to find it:** Bank statements, online banking and invoices.

## Related components

- `iban-view` — a read-only display of an International Bank Account Number (IBAN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/International_Bank_Account_Number

---

Lily™ and Lily Design System™ are trademarks.
