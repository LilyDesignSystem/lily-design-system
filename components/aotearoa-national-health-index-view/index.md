# Aotearoa National Health Index View

AotearoaNationalHealthIndexView is a headless read-only display of New Zealand's National Health Index (NHI) Number, New Zealand's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to AotearoaNationalHealthIndexInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
- Provides accessible name via the `label` prop
- Companion to AotearoaNationalHealthIndexInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Health Index (NHI) Number">
    <AotearoaNationalHealthIndexView label="National Health Index (NHI) Number" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored New Zealand National Health Index (NHI) Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `aotearoa-national-health-index-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.aotearoa-national-health-index-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.

**Where to find it:** Printed on prescriptions, hospital and GP correspondence, and visible in patient portals such as Manage My Health.

## Related components

- `aotearoa-national-health-index-input` — an input for entering New Zealand's National Health Index (NHI) Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [NHI Number](https://en.wikipedia.org/wiki/NHI_Number)

---

Lily™ and Lily Design System™ are trademarks.
