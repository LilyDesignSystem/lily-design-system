# Malta National Identification Number View

MaltaNationalIdentificationNumberView is a headless read-only display of Malta's Malta National Identification Number, Malta's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to MaltaNationalIdentificationNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era
- Provides accessible name via the `value` content
- Companion to MaltaNationalIdentificationNumberInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Malta National Identification Number">
    <MaltaNationalIdentificationNumberView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Malta Malta National Identification Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `malta-national-identification-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.malta-national-identification-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

Eight characters: seven digits and a trailing letter (M, G, A, P, L, H, B, or Z). The letter encodes the geographic origin and registration context: A foreigner with eRes Card; B Maltese births registered in the 1800s; G Gozitan births registered in the 1900s; H Gozitan births registered in the 2000s; L Maltese births registered in the 2000s; M Maltese births registered in the 1900s; P Maltese citizens registered without an original birth certificate from their country of birth; Z Gozitan births registered in the 1800s. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Maltese national identity card (Karta tal-Identità) issued by Identity Malta.

## Related components

- `malta-national-identification-number-input` — an input for entering Malta's Malta National Identification Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Malta

---

Lily™ and Lily Design System™ are trademarks.
