# Sverige Personnummer Input

SverigePersonnummerInput is a headless input for entering Sweden's Personnummer, Sweden's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to SverigePersonnummerView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to SverigePersonnummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Personal Identity Number" required>
  <SverigePersonnummerInput label="Personal Identity Number" value={value} required />
  <Hint>12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit</Hint>
  <ErrorMessage>Please enter a valid Personal Identity Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Sweden's Personnummer.
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `sverige-personnummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.sverige-personnummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Personnummer is Sweden's national-id identifier. Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.

## Related components

- `sverige-personnummer-view` — a read-only display of Sweden's Personnummer
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

---

Lily™ and Lily Design System™ are trademarks.
