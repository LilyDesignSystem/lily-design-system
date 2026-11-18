# Qazaqstan Zheke Saikestendiru Nomiri Input

QazaqstanZhekeSaikestendiruNomiriInput is a headless input for entering Kazakhstan's Individual Identification Number (IIN), Kazakhstan's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to QazaqstanZhekeSaikestendiruNomiriView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to QazaqstanZhekeSaikestendiruNomiriView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Individual Identification Number (IIN)"
  required
>
  <QazaqstanZhekeSaikestendiruNomiriInput
    label="Individual Identification Number (IIN)"
    value="{value}"
    required
  />
  <Hint
    >Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial
    and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to
    11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if
    it is 10 again the number is not issued.</Hint
  >
  <ErrorMessage>Please enter a valid Individual Identification Number (IIN)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Kazakhstan's Individual Identification Number (IIN).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `qazaqstan-zheke-saikestendiru-nomiri-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.qazaqstan-zheke-saikestendiru-nomiri-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.

**Where to find it:** Printed on the identity card and passport, and used as the personal tax number and in every eGov service.

## Related components

- `qazaqstan-zheke-saikestendiru-nomiri-view` — a read-only display of Kazakhstan's Individual Identification Number (IIN)
- `text-input` — a single-line text input field <input type="text">

## References

- [OECD: Kazakhstan TIN](https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf)
- [eGov.kz: Individual identification number](https://egov.kz/cms/en/articles/iin_info)

---

Lily™ and Lily Design System™ are trademarks.
