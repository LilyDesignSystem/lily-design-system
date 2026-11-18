# OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView

## Metadata

- Component: ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view
- PascalCase: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView
- Description: a read-only display of Uzbekistan's Personal identification number (JShShIR / PINFL)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view`
- Format: Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.
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

- [x] Renders <span> element with class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view in css-style-sheet-template.css
- Companion: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput
- [Kun.uz: Where to find your PINFL](https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl)
- [Uzbekistan passport](https://en.wikipedia.org/wiki/Uzbekistan_passport)
