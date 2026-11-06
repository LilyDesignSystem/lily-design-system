# Latvija Personas Kods View

LatvijaPersonasKodsView is a headless read-only display of Latvia's Personas kods, Latvia's national-id identifier. It renders as a `<span>`. It is the read-only companion to LatvijaPersonasKodsInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st)
- Provides accessible name via the `value` content
- Companion to LatvijaPersonasKodsInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Code">
    <LatvijaPersonasKodsView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Latvia Personas kods read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `latvija-personas-kods-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.latvija-personas-kods-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Eleven digits in the form DDMMYY-CZZZZ: the first six are the date of birth, C is the century sign (0 for 19th century, 1 for 20th, 2 for 21st), ZZZZ is a serial number, and the last digit is a check digit.

**Where to find it:** Latvian eID card, passport, driving licence, and the official Latvija.lv portal.

## Related components

- `latvija-personas-kods-input` — an input for entering Latvia's Personas kods
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Latvia

---

Lily™ and Lily Design System™ are trademarks.
