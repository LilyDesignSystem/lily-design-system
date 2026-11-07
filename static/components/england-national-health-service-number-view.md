# England National Health Service Number View

EnglandNationalHealthServiceNumberView is a headless read-only display of England's National Health Service Number (NHS), England's healthcare identifier. It renders as a `<span>`. It is the read-only companion to EnglandNationalHealthServiceNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service
- Provides accessible name via the `value` content
- Companion to EnglandNationalHealthServiceNumberInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Health Service Number">
    <EnglandNationalHealthServiceNumberView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored England National Health Service Number (NHS) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `england-national-health-service-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.england-national-health-service-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Ten-digit number in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service and used as the key patient identifier across the English NHS.

**Where to find it:** NHS medical card, GP correspondence, prescriptions, hospital letters, the NHS App and NHS login, and online services such as patient.nhs.uk.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `england-national-health-service-number-input` — an input for entering England's National Health Service Number (NHS)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/NHS_number

---

Lily™ and Lily Design System™ are trademarks.
