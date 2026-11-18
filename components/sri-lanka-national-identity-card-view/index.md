# Sri Lanka National Identity Card View

SriLankaNationalIdentityCardView is a headless read-only display of Sri Lanka's National Identity Card (NIC) number, Sri Lanka's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to SriLankaNationalIdentityCardInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.
- Provides accessible name via the `label` prop
- Companion to SriLankaNationalIdentityCardInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Identity Card (NIC) number">
    <SriLankaNationalIdentityCardView
      label="National Identity Card (NIC) number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored National Identity Card (NIC) number from Sri Lanka read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `sri-lanka-national-identity-card-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.sri-lanka-national-identity-card-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.

**Where to find it:** Printed on the National Identity Card issued by the Department for Registration of Persons, and asked for by banks, employers and state services.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `sri-lanka-national-identity-card-input` — an input for entering Sri Lanka's National Identity Card (NIC) number
- `summary-list-item` — one key-value pair in a summary list

## References

- [National identity card (Sri Lanka)](<https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)>)

---

Lily™ and Lily Design System™ are trademarks.
