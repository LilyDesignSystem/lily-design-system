# IndonesiaNomorIndukKependudukanView

## Metadata

- Component: indonesia-nomor-induk-kependudukan-view
- PascalCase: IndonesiaNomorIndukKependudukanView
- Description: a read-only display of Indonesia's Nomor Induk Kependudukan (NIK)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .indonesia-nomor-induk-kependudukan-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `indonesia-nomor-induk-kependudukan-view`
- Format: Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.
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

- [x] Renders <span> element with class="indonesia-nomor-induk-kependudukan-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .indonesia-nomor-induk-kependudukan-view in css-style-sheet-template.css
- Companion: IndonesiaNomorIndukKependudukanInput
- Wikipedia: [National identification number § Indonesia](https://en.wikipedia.org/wiki/National_identification_number#Indonesia)
