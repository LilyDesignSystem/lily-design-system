# IndonesiaNomorIndukKependudukanInput

## Metadata

- Component: indonesia-nomor-induk-kependudukan-input
- PascalCase: IndonesiaNomorIndukKependudukanInput
- Description: an input for entering Indonesia's Nomor Induk Kependudukan (NIK)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .indonesia-nomor-induk-kependudukan-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `indonesia-nomor-induk-kependudukan-input`
- Format: Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.
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

- [x] Renders <input> element with class="indonesia-nomor-induk-kependudukan-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .indonesia-nomor-induk-kependudukan-input in css-style-sheet-template.css
- Companion: IndonesiaNomorIndukKependudukanView
- Wikipedia: [National identification number § Indonesia](https://en.wikipedia.org/wiki/National_identification_number#Indonesia)
