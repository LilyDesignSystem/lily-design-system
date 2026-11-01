# NigeriaNationalIdentificationNumberView

## Metadata

- Component: nigeria-national-identification-number-view
- PascalCase: NigeriaNationalIdentificationNumberView
- Description: a read-only display of Nigeria's National Identification Number (NIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .nigeria-national-identification-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `nigeria-national-identification-number-view`
- Format: Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit algorithm is published, so only the length and digits can be checked.
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

- [x] Renders <span> element with class="nigeria-national-identification-number-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nigeria-national-identification-number-view in css-style-sheet-template.css
- Companion: NigeriaNationalIdentificationNumberInput
- Wikipedia: [National Identity Management Commission](https://en.wikipedia.org/wiki/National_Identity_Management_Commission)
