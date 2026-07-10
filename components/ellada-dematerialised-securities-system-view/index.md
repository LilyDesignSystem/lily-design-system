# Ellada Dematerialised Securities System View

ElladaDematerialisedSecuritiesSystemView is a headless read-only display of Greece's Dematerialised Securities System (DSS), Greece's securities identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to ElladaDematerialisedSecuritiesSystemInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece
- Provides accessible name via the `value` content
- Companion to ElladaDematerialisedSecuritiesSystemInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Dematerialised Securities System">
    <ElladaDematerialisedSecuritiesSystemView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

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

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Dematerialised Securities System (DSS) is Greece's securities identifier. Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece.

## Related components

- `ellada-dematerialised-securities-system-input` — an input for entering Greece's Dematerialised Securities System (DSS)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Central_Securities_Depository

---

Lily™ and Lily Design System™ are trademarks.
