# Al Imarat Raqm Al Huwiyah View

AlImaratRaqmAlHuwiyahView is a headless read-only display of the United Arab Emirates' Emirates ID number, the United Arab Emirates' government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to AlImaratRaqmAlHuwiyahInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.
- Provides accessible name via the `label` prop
- Companion to AlImaratRaqmAlHuwiyahInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Emirates ID number">
    <AlImaratRaqmAlHuwiyahView
      label="Emirates ID number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored Emirates ID number from the United Arab Emirates read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `al-imarat-raqm-al-huwiyah-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.al-imarat-raqm-al-huwiyah-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.

**Where to find it:** Printed on the Emirates ID card issued by the Federal Authority for Identity, Citizenship, Customs and Port Security (ICP), and used as the patient identifier in UAE health records.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `al-imarat-raqm-al-huwiyah-input` — an input for entering the United Arab Emirates' Emirates ID number
- `summary-list-item` — one key-value pair in a summary list

## References

- [Emirates ID](https://en.wikipedia.org/wiki/Emirates_ID)
- [Microsoft Purview: U.A.E. identity card number](https://learn.microsoft.com/en-us/purview/sit-defn-uae-identity-card-number)

---

Lily™ and Lily Design System™ are trademarks.
