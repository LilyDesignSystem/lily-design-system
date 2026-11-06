# Nederland Paspoort Nummer View

NederlandPaspoortNummerView is a headless read-only display of Netherlands's Paspoort Nummer, Netherlands's passport identifier. It renders as a `<span>`. It is the read-only companion to NederlandPaspoortNummerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9]
- Provides accessible name via the `value` content
- Companion to NederlandPaspoortNummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Dutch Passport Number">
    <NederlandPaspoortNummerView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Netherlands Paspoort Nummer read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `nederland-paspoort-nummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nederland-paspoort-nummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Nine characters: positions 1 and 2 are uppercase letters [A-Z] except O; positions 3–8 are alphanumeric [A-Z][0-9] except O; position 9 is a digit [0-9]. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Dutch passport (Nederlands paspoort), printed on the data page and in the machine-readable zone.

## Related components

- `nederland-paspoort-nummer-input` — an input for entering Netherlands's Paspoort Nummer
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Dutch_passport

---

Lily™ and Lily Design System™ are trademarks.
