# Mauritius National Identity Card Number View

MauritiusNationalIdentityCardNumberView is a headless read-only display of Mauritius's National Identity Card number, Mauritius's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to MauritiusNationalIdentityCardNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters' positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.
- Provides accessible name via the `label` prop
- Companion to MauritiusNationalIdentityCardNumberInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Identity Card number">
    <MauritiusNationalIdentityCardNumberView
      label="National Identity Card number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored National Identity Card number from Mauritius read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `mauritius-national-identity-card-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.mauritius-national-identity-card-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters' positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.

**Where to find it:** Printed on the National Identity Card, and given at birth registration.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `mauritius-national-identity-card-number-input` — an input for entering Mauritius's National Identity Card number
- `summary-list-item` — one key-value pair in a summary list

## Known limitations

None known.

## References

- [python-stdnum: stdnum.mu.nid](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid)
- [List of national identity card policies by country](https://en.wikipedia.org/wiki/List_of_national_identity_card_policies_by_country)

---

Lily™ and Lily Design System™ are trademarks.
