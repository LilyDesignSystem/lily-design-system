# CeskoCestovniPasView

## Metadata

- Component: cesko-cestovni-pas-view
- PascalCase: CeskoCestovniPasView
- Description: a read-only display of Czech Republic's Cestovní pas
- HTML tag: <span>
- CSS class: .cesko-cestovni-pas-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `cesko-cestovni-pas-view` and `role="text"`
- Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior
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

- [ ] Renders <span> element with class="cesko-cestovni-pas-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cesko-cestovni-pas-view in css-style-sheet-template.css
- Companion: CeskoCestovniPasInput
- Wikipedia: https://en.wikipedia.org/wiki/Czech_passport
