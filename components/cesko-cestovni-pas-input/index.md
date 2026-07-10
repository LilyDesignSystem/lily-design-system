# Cesko Cestovni Pas Input

CeskoCestovniPasInput is a headless input for entering Czech Republic's Cestovní pas, Czech Republic's passport identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to CeskoCestovniPasView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to CeskoCestovniPasView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Czech Passport" required>
  <CeskoCestovniPasInput label="Czech Passport" value={value} required />
  <Hint>usually 8 digits, sometimes longer, issued by the Ministry of the Interior</Hint>
  <ErrorMessage>Please enter a valid Czech Passport</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Czech Republic's Cestovní pas.
- Use with pattern validation matching the documented format.
- Use in administrative or passport workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `cesko-cestovni-pas-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.cesko-cestovni-pas-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Cestovní pas is Czech Republic's passport identifier. Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.

## Related components

- `cesko-cestovni-pas-view` — a read-only display of Czech Republic's Cestovní pas
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Czech_passport

---

Lily™ and Lily Design System™ are trademarks.
