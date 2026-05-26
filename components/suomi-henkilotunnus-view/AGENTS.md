# SuomiHenkilotunnusView

## Metadata

- Component: suomi-henkilotunnus-view
- PascalCase: SuomiHenkilotunnusView
- Description: a read-only display of Finland's Henkilötunnus (HETU)
- HTML tag: <span>
- CSS class: .suomi-henkilotunnus-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `suomi-henkilotunnus-view` and `role="text"`
- Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop
- `role="text"` so the identifier announces as a single unit

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible name override via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="suomi-henkilotunnus-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .suomi-henkilotunnus-view in css-style-sheet-template.css
- Companion: SuomiHenkilotunnusInput
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)
