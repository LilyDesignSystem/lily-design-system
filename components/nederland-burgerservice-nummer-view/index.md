# Nederland Burgerservice Nummer View

NederlandBurgerserviceNummerView is a headless read-only display of Netherlands's Burgerservicenummer (BSN), Netherlands's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to NederlandBurgerserviceNummerInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm
- Provides accessible name via the `value` content
- Companion to NederlandBurgerserviceNummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Citizen Service Number">
    <NederlandBurgerserviceNummerView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Netherlands Burgerservicenummer (BSN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `nederland-burgerservice-nummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nederland-burgerservice-nummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Burgerservicenummer (BSN) is Netherlands's national-id identifier. Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.

## Related components

- `nederland-burgerservice-nummer-input` — an input for entering Netherlands's Burgerservicenummer (BSN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Burgerservicenummer

---

Lily™ and Lily Design System™ are trademarks.
