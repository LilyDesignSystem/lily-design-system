# GhanaCardPersonalIdentificationNumberView

## Metadata

- Component: ghana-card-personal-identification-number-view
- PascalCase: GhanaCardPersonalIdentificationNumberView
- Description: a read-only display of Ghana's Ghana Card PIN
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .ghana-card-personal-identification-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `ghana-card-personal-identification-number-view`
- Format: A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.
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

- [x] Renders <span> element with class="ghana-card-personal-identification-number-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .ghana-card-personal-identification-number-view in css-style-sheet-template.css
- Companion: GhanaCardPersonalIdentificationNumberInput
- [Ghana Card](https://en.wikipedia.org/wiki/Ghana_Card)
- [National Identification Authority: The GhanaCard](https://nia.gov.gh/the-ghanacard-introduction/)
