# LuxembourgMatriculeView

## Metadata

- Component: luxembourg-matricule-view
- PascalCase: LuxembourgMatriculeView
- Description: a read-only display of Luxembourg's Numéro d'Identification Nationale (Matricule)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .luxembourg-matricule-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `luxembourg-matricule-view`
- Format: Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible name via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="luxembourg-matricule-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .luxembourg-matricule-view in css-style-sheet-template.css
- Companion: LuxembourgMatriculeInput
- Wikipedia: [Numéro d'identification national](https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html)
