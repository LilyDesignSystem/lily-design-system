# Luxembourg Matricule View

LuxembourgMatriculeView is a headless read-only display of Luxembourg's Numéro d'Identification Nationale (Matricule), Luxembourg's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to LuxembourgMatriculeInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.
- Provides accessible name via the `label` prop
- Companion to LuxembourgMatriculeInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Numéro d'Identification Nationale (Matricule)">
    <LuxembourgMatriculeView label="Numéro d'Identification Nationale (Matricule)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Luxembourg Numéro d'Identification Nationale (Matricule) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `luxembourg-matricule-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.luxembourg-matricule-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.

**Where to find it:** Printed on the Luxembourg eID card and required for CCSS (Centre commun de la sécurité sociale) health-insurance registration, tax, and social-security records.

## Related components

- `luxembourg-matricule-input` — an input for entering Luxembourg's Numéro d'Identification Nationale (Matricule)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Numéro d'identification national](https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html)

---

Lily™ and Lily Design System™ are trademarks.
