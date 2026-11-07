# Eesti Isikukood View

EestiIsikukoodView is a headless read-only display of Estonia's Isikukood (IK), Estonia's national-id identifier. It renders as a `<span>`. It is the read-only companion to EestiIsikukoodInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum
- Provides accessible name via the `value` content
- Companion to EestiIsikukoodInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Identification Code">
    <EestiIsikukoodView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Estonia Isikukood (IK) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `eesti-isikukood-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.eesti-isikukood-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Eleven digits in the form GYYMMDDSSSC: G encodes sex and century of birth (1–2 for the 19th century, 3–4 for the 20th, 5–6 for the 21st, with odd numbers male and even female); YYMMDD is the date of birth; SSS is a serial number; and C is a Modulus-11 check digit.

**Where to find it:** Estonian ID card (ID-kaart), passport, residence permit, driving licence, and digital signing services such as Smart-ID and Mobiil-ID.

## Related components

- `eesti-isikukood-input` — an input for entering Estonia's Isikukood (IK)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Estonia

---

Lily™ and Lily Design System™ are trademarks.
