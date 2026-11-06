# PrathetThaiLekPrajamTuaPrachachonView

## Metadata

- Component: prathet-thai-lek-prajam-tua-prachachon-view
- PascalCase: PrathetThaiLekPrajamTuaPrachachonView
- Description: a read-only display of Thailand's เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .prathet-thai-lek-prajam-tua-prachachon-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `prathet-thai-lek-prajam-tua-prachachon-view`
- Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="prathet-thai-lek-prajam-tua-prachachon-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .prathet-thai-lek-prajam-tua-prachachon-view in css-style-sheet-template.css
- Companion: PrathetThaiLekPrajamTuaPrachachonInput
- Wikipedia: [Thai identity card](https://en.wikipedia.org/wiki/Thai_identity_card)
