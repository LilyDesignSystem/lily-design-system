# Polska Numer Identyfikacji Podatkowej View

PolskaNumerIdentyfikacjiPodatkowejView is a headless read-only display of Poland's Numer Identyfikacji Podatkowej (NIP), Poland's tax identifier. It renders as a `<span>`. It is the read-only companion to PolskaNumerIdentyfikacjiPodatkowejInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 10 numeric digits used for tax identification
- Provides accessible name via the `value` content
- Companion to PolskaNumerIdentyfikacjiPodatkowejInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Tax Identification Number">
    <PolskaNumerIdentyfikacjiPodatkowejView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Poland Numer Identyfikacji Podatkowej (NIP) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `polska-numer-identyfikacji-podatkowej-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.polska-numer-identyfikacji-podatkowej-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Ten numeric digits with a Modulus-11 weighted check digit, used by investment firms and the tax administration to identify a person or organisation for tax purposes.

**Where to find it:** NIP confirmation document, tax forms (PIT, including the PIT-8 issued by investment firms), invoices, and contracts.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `polska-numer-identyfikacji-podatkowej-input` — an input for entering Poland's Numer Identyfikacji Podatkowej (NIP)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Poland

---

Lily™ and Lily Design System™ are trademarks.
