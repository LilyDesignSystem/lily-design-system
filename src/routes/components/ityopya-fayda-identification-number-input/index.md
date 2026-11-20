# Ityopya Fayda Identification Number Input

ItyopyaFaydaIdentificationNumberInput is a headless input for entering Ethiopia's Fayda Identification Number (FIN), Ethiopia's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to ItyopyaFaydaIdentificationNumberView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to ItyopyaFaydaIdentificationNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Fayda Identification Number (FIN)"
  required
>
  <ItyopyaFaydaIdentificationNumberInput
    label="Fayda Identification Number (FIN)"
    value="{value}"
    required
  />
  <Hint
    >Twelve digits issued by the National ID Program (NIDP). The number encodes no personal
    attributes and no check-digit algorithm is published, so only the length and digits can be
    checked. Do not confuse it with the six-digit Fayda alternative number used to link bank
    accounts.</Hint
  >
  <ErrorMessage>Please enter a valid Fayda Identification Number (FIN)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Ethiopia's Fayda Identification Number (FIN).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `ityopya-fayda-identification-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ityopya-fayda-identification-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.

**Where to find it:** Sent by SMS when registration is complete, printed on the Fayda card, and asked for by banks and telecoms.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `ityopya-fayda-identification-number-view` — a read-only display of Ethiopia's Fayda Identification Number (FIN)
- `text-input` — a single-line text input field <input type="text">

## Known limitations

None known.

## References

- [Fayda ID](https://en.wikipedia.org/wiki/Fayda_ID)

---

Lily™ and Lily Design System™ are trademarks.
