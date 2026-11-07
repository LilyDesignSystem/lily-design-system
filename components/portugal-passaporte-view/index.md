# Portugal Passaporte View

PortugalPassaporteView is a headless read-only display of Portugal's Passaporte, Portugal's passport identifier. It renders as a `<span>`. It is the read-only companion to PortugalPassaporteInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 1 letter [A-Z] and 6 digits [0-9]
- Provides accessible name via the `value` content
- Companion to PortugalPassaporteInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Portuguese Passport">
    <PortugalPassaporteView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Portugal Passaporte read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `portugal-passaporte-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.portugal-passaporte-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Uniform optical-model passport identified by one letter and six digits — position 1 is a letter [A-Z] and positions 2–6 are digits [0-9]. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Portuguese passport, printed on the data page and in the machine-readable zone.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `portugal-passaporte-input` — an input for entering Portugal's Passaporte
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Portuguese_passport

---

Lily™ and Lily Design System™ are trademarks.
