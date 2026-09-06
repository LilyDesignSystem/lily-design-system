# Island Kennitala View

IslandKennitalaView is a headless read-only display of Iceland's Kennitala, Iceland's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to IslandKennitalaInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 10 digits where the first 6 are the date of birth (DDMMYY)
- Provides accessible name via the `value` content
- Companion to IslandKennitalaInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Identity Code">
    <IslandKennitalaView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Iceland Kennitala read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `island-kennitala-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.island-kennitala-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

Ten-digit identifier in the form DDMMYY-RRCC: the first six digits are the date of birth, the next two are a random serial, then a Modulus-11 check digit, and a final digit denoting the century of birth (9 for 19th, 0 for 20th, 1 for 21st).

**Where to find it:** Icelandic National Registry (Þjóðskrá Íslands) record, national ID card, passport, driving licence, and all official forms and contracts.

## Related components

- `island-kennitala-input` — an input for entering Iceland's Kennitala
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Kennitala

---

Lily™ and Lily Design System™ are trademarks.
