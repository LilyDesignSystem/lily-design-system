# Cesko Rodne Cislo View

CeskoRodneCisloView is a headless read-only display of Czech Republic's Rodné číslo (RČ), Czech Republic's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to CeskoRodneCisloInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11
- Provides accessible name via the `value` content
- Companion to CeskoRodneCisloInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Czech Personal Number">
    <CeskoRodneCisloView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Czech Republic Rodné číslo (RČ) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `cesko-rodne-cislo-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.cesko-rodne-cislo-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

Nine- or ten-digit number in the form YYXXDD/SSSC: YY is the last two digits of the year of birth; XX is the month of birth (01–12 for men, 51–62 for women, with +70 used when serial numbers run out); DD is the day; SSS is a serial number; and C is a check digit (omitted for people born before 1 January 1954). A ten-digit number must be divisible by 11.

**Where to find it:** Birth certificate, national ID card (občanský průkaz), driving licence, and health-insurance card.

## Related components

- `cesko-rodne-cislo-input` — an input for entering Czech Republic's Rodné číslo (RČ)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

---

Lily™ and Lily Design System™ are trademarks.
