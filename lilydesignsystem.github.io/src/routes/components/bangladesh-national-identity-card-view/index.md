# Bangladesh National Identity Card View

BangladeshNationalIdentityCardView is a headless read-only display of Bangladesh's National ID (NID) number, Bangladesh's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to BangladeshNationalIdentityCardInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit number with the four-digit year of birth in front) and 10 digits on the smart card since 2016, nine of them random and the last a check digit whose algorithm is not published. Accept all three lengths.
- Provides accessible name via the `label` prop
- Companion to BangladeshNationalIdentityCardInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National ID (NID) number">
    <BangladeshNationalIdentityCardView
      label="National ID (NID) number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored National ID (NID) number from Bangladesh read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `bangladesh-national-identity-card-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.bangladesh-national-identity-card-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit number with the four-digit year of birth in front) and 10 digits on the smart card since 2016, nine of them random and the last a check digit whose algorithm is not published. Accept all three lengths.

**Where to find it:** Printed on the National ID card (smart card or laminated card), and asked for to register a SIM card, open a bank account or apply for a passport.

## Related components

- `bangladesh-national-identity-card-input` — an input for entering Bangladesh's National ID (NID) number
- `summary-list-item` — one key-value pair in a summary list

## References

- [National identity card (Bangladesh)](<https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)>)
- [bdnews24: EC decides on 10-digit smart NID cards](https://bdnews24.com/bangladesh/election-commission-decides-on-10-digit-smart-nid-cards-for-bangladesh-nationals)

---

Lily™ and Lily Design System™ are trademarks.
