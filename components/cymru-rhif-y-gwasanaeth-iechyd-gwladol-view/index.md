# Cymru Rhif Y Gwasanaeth Iechyd Gwladol View

CymruRhifYGwasanaethIechydGwladolView is a headless read-only display of Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG), Wales's healthcare identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to CymruRhifYGwasanaethIechydGwladolInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man)
- Provides accessible name via the `value` content
- Companion to CymruRhifYGwasanaethIechydGwladolInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Health Service Number">
    <CymruRhifYGwasanaethIechydGwladolView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Wales Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `cymru-rhif-y-gwasanaeth-iechyd-gwladol-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.cymru-rhif-y-gwasanaeth-iechyd-gwladol-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG) is Wales's healthcare identifier. Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).

## Related components

- `cymru-rhif-y-gwasanaeth-iechyd-gwladol-input` — an input for entering Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/NHS_number

---

Lily™ and Lily Design System™ are trademarks.
