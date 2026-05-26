# Bulgaria Edinen Grazhdanski Nomer Input

BulgariaEdinenGrazhdanskiNomerInput is a headless input for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN), Bulgaria's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to BulgariaEdinenGrazhdanskiNomerView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to BulgariaEdinenGrazhdanskiNomerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Uniform Civil Number" required>
  <BulgariaEdinenGrazhdanskiNomerInput label="Uniform Civil Number" value={value} required />
  <Hint>10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit</Hint>
  <ErrorMessage>Please enter a valid Uniform Civil Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `bulgaria-edinen-grazhdanski-nomer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.bulgaria-edinen-grazhdanski-nomer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Единен граждански номер / Edinen grazhdanski nomer (EGN) is Bulgaria's national-id identifier. Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.

## Related components

- `bulgaria-edinen-grazhdanski-nomer-view` — a read-only display of Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Unique_citizenship_number
