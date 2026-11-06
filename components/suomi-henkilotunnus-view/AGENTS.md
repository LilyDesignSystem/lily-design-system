# SuomiHenkilotunnusView

## Metadata

- Component: suomi-henkilotunnus-view
- PascalCase: SuomiHenkilotunnusView
- Description: a read-only display of Finland's Henkilötunnus (HETU)
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .suomi-henkilotunnus-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `suomi-henkilotunnus-view`, and no role
- Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="suomi-henkilotunnus-view"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .suomi-henkilotunnus-view in css-style-sheet-template.css
- Companion: SuomiHenkilotunnusInput
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)
