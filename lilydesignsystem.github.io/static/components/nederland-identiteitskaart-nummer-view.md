# Nederland Identiteitskaart Nummer View

NederlandIdentiteitskaartNummerView is a headless read-only display of Netherlands's Identiteitskaart Nummer, Netherlands's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to NederlandIdentiteitskaartNummerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted
- Provides accessible name via the `value` content
- Companion to NederlandIdentiteitskaartNummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Dutch National Identity Card Number">
    <NederlandIdentiteitskaartNummerView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Netherlands Identiteitskaart Nummer read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `nederland-identiteitskaart-nummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nederland-identiteitskaart-nummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

Nine characters: positions 1 and 2 are uppercase letters [A-Z] except O; positions 3–8 are alphanumeric [A-Z][0-9] except the letter O; position 9 is a digit [0-9]. The character O is disallowed (to avoid confusion with 0), but the digit 0 is allowed. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Dutch national identity card (Nederlandse identiteitskaart), printed on the front of the card and in the machine-readable zone.

## Related components

- `nederland-identiteitskaart-nummer-input` — an input for entering Netherlands's Identiteitskaart Nummer
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Dutch_identity_card

---

Lily™ and Lily Design System™ are trademarks.
