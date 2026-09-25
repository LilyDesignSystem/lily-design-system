# AotearoaNationalHealthIndexView

## Metadata

- Component: aotearoa-national-health-index-view
- PascalCase: AotearoaNationalHealthIndexView
- Description: a read-only display of New Zealand's National Health Index (NHI) Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .aotearoa-national-health-index-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `aotearoa-national-health-index-view`
- Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
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

- [x] Renders <span> element with class="aotearoa-national-health-index-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .aotearoa-national-health-index-view in css-style-sheet-template.css
- Companion: AotearoaNationalHealthIndexInput
- Wikipedia: [NHI Number](https://en.wikipedia.org/wiki/NHI_Number)
