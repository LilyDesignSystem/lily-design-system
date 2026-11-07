# Hrvatska Osobni Identifikacijski Broj View

HrvatskaOsobniIdentifikacijskiBrojView is a headless read-only display of Croatia's Osobni identifikacijski broj (OIB), Croatia's national-id identifier. It renders as a `<span>`. It is the read-only companion to HrvatskaOsobniIdentifikacijskiBrojInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person
- Provides accessible name via the `value` content
- Companion to HrvatskaOsobniIdentifikacijskiBrojInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Identification Number">
    <HrvatskaOsobniIdentifikacijskiBrojView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Croatia Osobni identifikacijski broj (OIB) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `hrvatska-osobni-identifikacijski-broj-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.hrvatska-osobni-identifikacijski-broj-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Eleven-digit code: ten randomly assigned digits with no information about the holder, followed by an ISO 7064 MOD 11,10 check digit. OIB is unique, unchangeable, and unrepeatable, and is the permanent identification code of every Croatian citizen and every legal person headquartered in Croatia.

**Where to find it:** Croatian national identity card (Osobna iskaznica), passport, driving licence, tax records (Porezna uprava lookup), and most personal documents.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `hrvatska-osobni-identifikacijski-broj-input` — an input for entering Croatia's Osobni identifikacijski broj (OIB)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

---

Lily™ and Lily Design System™ are trademarks.
