# LuxembourgMatriculeInput

## Metadata

- Component: luxembourg-matricule-input
- PascalCase: LuxembourgMatriculeInput
- Description: an input for entering Luxembourg's Numéro d'Identification Nationale (Matricule)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .luxembourg-matricule-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `luxembourg-matricule-input`
- Format: Thirteen digits in the form YYYYMMDDNNNCC: the first eight digits encode date of birth (YYYYMMDD); the next three are a sequence number; the twelfth digit is a Luhn (Modulus-10) check digit computed over the first eleven digits; the thirteenth digit is a second, independent check digit computed with the Verhoeff algorithm over the first twelve digits.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <input> element with class="luxembourg-matricule-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .luxembourg-matricule-input in css-style-sheet-template.css
- Companion: LuxembourgMatriculeView
- Wikipedia: [Numéro d'identification national](https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html)
