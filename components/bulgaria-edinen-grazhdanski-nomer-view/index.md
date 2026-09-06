# Bulgaria Edinen Grazhdanski Nomer View

BulgariaEdinenGrazhdanskiNomerView is a headless read-only display of Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN), Bulgaria's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to BulgariaEdinenGrazhdanskiNomerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit
- Provides accessible name via the `value` content
- Companion to BulgariaEdinenGrazhdanskiNomerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Uniform Civil Number">
    <BulgariaEdinenGrazhdanskiNomerView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Bulgaria Единен граждански номер / Edinen grazhdanski nomer (EGN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `bulgaria-edinen-grazhdanski-nomer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.bulgaria-edinen-grazhdanski-nomer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

Ten digits in the form YYMMDD-RRRGC: the first six encode the date of birth (with a month offset of +20 for 19th-century births and +40 for 21st-century births), three regional/serial digits, a gender digit (even for male, odd for female), and a weighted Modulus-10 check digit.

**Where to find it:** Bulgarian national identity card (Лична карта), passport, driving licence, and birth certificate.

## Related components

- `bulgaria-edinen-grazhdanski-nomer-input` — an input for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Unique_citizenship_number

---

Lily™ and Lily Design System™ are trademarks.
