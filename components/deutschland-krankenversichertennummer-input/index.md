# Deutschland Krankenversichertennummer Input

DeutschlandKrankenversichertennummerInput is a headless input for entering Germany's Krankenversichertennummer (KVNR), Germany's healthcare identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to DeutschlandKrankenversichertennummerView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: a random capital letter followed by eight random digits and a Luhn check digit
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to DeutschlandKrankenversichertennummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Health Insurance Number" required>
  <DeutschlandKrankenversichertennummerInput label="Health Insurance Number" value={value} required />
  <Hint>a random capital letter followed by eight random digits and a Luhn check digit</Hint>
  <ErrorMessage>Please enter a valid Health Insurance Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Germany's Krankenversichertennummer (KVNR).
- Use with pattern validation matching the documented format.
- Use in administrative or healthcare workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `deutschland-krankenversichertennummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.deutschland-krankenversichertennummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Krankenversichertennummer (KVNR) is Germany's healthcare identifier. Format: a random capital letter followed by eight random digits and a Luhn check digit.

## Related components

- `deutschland-krankenversichertennummer-view` — a read-only display of Germany's Krankenversichertennummer (KVNR)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://de.wikipedia.org/wiki/Krankenversichertennummer

---

Lily™ and Lily Design System™ are trademarks.
