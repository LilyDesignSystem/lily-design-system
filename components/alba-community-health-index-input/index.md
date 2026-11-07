# Alba Community Health Index Input

AlbaCommunityHealthIndexInput is a headless input for entering Scotland's Community Health Index (CHI), Scotland's healthcare identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to AlbaCommunityHealthIndexView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to AlbaCommunityHealthIndexView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Community Health Index"
  required
>
  <AlbaCommunityHealthIndexInput
    label="Community Health Index"
    value="{value}"
    required
  />
  <Hint
    >10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even
    female) + a Modulus-11 check digit</Hint
  >
  <ErrorMessage>Please enter a valid Community Health Index</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Scotland's Community Health Index (CHI).
- Use with pattern validation matching the documented format.
- Use in administrative or healthcare workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `alba-community-health-index-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.alba-community-health-index-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten-digit number identifying every patient registered with NHS Scotland; encodes the date of birth (DDMMYY), two random digits, a sex digit (odd male, even female), and a Modulus-11 check digit.

**Where to find it:** Printed on the NHS Scotland medical card, prescriptions, GP correspondence, hospital appointment letters, and the NHS Inform patient portal.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `alba-community-health-index-view` — a read-only display of Scotland's Community Health Index (CHI)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_Health_Service_Central_Register

---

Lily™ and Lily Design System™ are trademarks.
