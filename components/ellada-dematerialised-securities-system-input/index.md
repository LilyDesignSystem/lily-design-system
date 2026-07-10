# Ellada Dematerialised Securities System Input

ElladaDematerialisedSecuritiesSystemInput is a headless input for entering Greece's Dematerialised Securities System (DSS), Greece's securities identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to ElladaDematerialisedSecuritiesSystemView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to ElladaDematerialisedSecuritiesSystemView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Dematerialised Securities System" required>
  <ElladaDematerialisedSecuritiesSystemInput label="Dematerialised Securities System" value={value} required />
  <Hint>10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece</Hint>
  <ErrorMessage>Please enter a valid Dematerialised Securities System</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Greece's Dematerialised Securities System (DSS).
- Use with pattern validation matching the documented format.
- Use in administrative or securities workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `ellada-dematerialised-securities-system-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ellada-dematerialised-securities-system-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Dematerialised Securities System (DSS) is Greece's securities identifier. Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece.

## Related components

- `ellada-dematerialised-securities-system-view` — a read-only display of Greece's Dematerialised Securities System (DSS)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Central_Securities_Depository

---

Lily™ and Lily Design System™ are trademarks.
