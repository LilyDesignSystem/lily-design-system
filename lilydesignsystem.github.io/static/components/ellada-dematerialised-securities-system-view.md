# Ellada Dematerialised Securities System View

ElladaDematerialisedSecuritiesSystemView is a headless read-only display of Greece's Dematerialised Securities System (DSS), Greece's securities identifier. It renders as a `<span>`. It is the read-only companion to ElladaDematerialisedSecuritiesSystemInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece
- Provides accessible name via the `value` content
- Companion to ElladaDematerialisedSecuritiesSystemInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Dematerialised Securities System">
    <ElladaDematerialisedSecuritiesSystemView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Greece Dematerialised Securities System (DSS) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `ellada-dematerialised-securities-system-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ellada-dematerialised-securities-system-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Ten-digit investor identifier linked to personal details (name, identity-card number, passport number, tax registration number); the investor share is the account record held in the DSS operated by the Hellenic Central Securities Depository (ATHEXCSD). No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Account statements and confirmations issued by the Hellenic Central Securities Depository (ATHEXCSD) and by the investor's appointed operator (broker or bank).

## Related components

- `ellada-dematerialised-securities-system-input` — an input for entering Greece's Dematerialised Securities System (DSS)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Central_Securities_Depository

---

Lily™ and Lily Design System™ are trademarks.
