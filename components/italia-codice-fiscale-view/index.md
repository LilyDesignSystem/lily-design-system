# Italia Codice Fiscale View

ItaliaCodiceFiscaleView is a headless read-only display of Italy's Codice fiscale (CF), Italy's tax/healthcare identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to ItaliaCodiceFiscaleInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character
- Provides accessible name via the `value` content
- Companion to ItaliaCodiceFiscaleInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Italian Fiscal Code">
    <ItaliaCodiceFiscaleView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Italy Codice fiscale (CF) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `italia-codice-fiscale-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.italia-codice-fiscale-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

Sixteen-character alphanumeric code issued by the Agenzia delle Entrate, derived from surname (3 letters), given name (3 letters), date of birth and sex (5 alphanumeric characters with day +40 for women), place of birth (4-character Belfiore code), and a final check letter. Example: RSSMRA62B25E205Y.

**Where to find it:** Codice Fiscale paper card or Tessera Sanitaria (national health-service card), which carries the fiscal code on a magnetic stripe.

## Related components

- `italia-codice-fiscale-input` — an input for entering Italy's Codice fiscale (CF)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Italian_fiscal_code

---

Lily™ and Lily Design System™ are trademarks.
