# PolskaNumerIdentyfikacjiPodatkowejView

## Metadata

- Component: polska-numer-identyfikacji-podatkowej-view
- PascalCase: PolskaNumerIdentyfikacjiPodatkowejView
- Description: a read-only display of Poland's Numer Identyfikacji Podatkowej (NIP)
- HTML tag: <span>
- CSS class: .polska-numer-identyfikacji-podatkowej-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `polska-numer-identyfikacji-podatkowej-view` and `role="text"`
- Format: 10 numeric digits used for tax identification
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

- [ ] Renders <span> element with class="polska-numer-identyfikacji-podatkowej-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .polska-numer-identyfikacji-podatkowej-view in css-style-sheet-template.css
- Companion: PolskaNumerIdentyfikacjiPodatkowejInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Poland
