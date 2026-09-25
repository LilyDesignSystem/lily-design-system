# MagyarorszagTajSzamView

## Metadata

- Component: magyarorszag-taj-szam-view
- PascalCase: MagyarorszagTajSzamView
- Description: a read-only display of Hungary's Társadalombiztosítási Azonosító Jel (TAJ)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .magyarorszag-taj-szam-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `magyarorszag-taj-szam-view`
- Format: Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an algorithm unique to Hungary, distinct from Luhn.
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

- [x] Renders <span> element with class="magyarorszag-taj-szam-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .magyarorszag-taj-szam-view in css-style-sheet-template.css
- Companion: MagyarorszagTajSzamInput
- Wikipedia: [Társadalombiztosítási azonosító jel](https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel)
