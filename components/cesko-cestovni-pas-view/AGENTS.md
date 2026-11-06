# CeskoCestovniPasView

## Metadata

- Component: cesko-cestovni-pas-view
- PascalCase: CeskoCestovniPasView
- Description: a read-only display of Czech Republic's Cestovní pas
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .cesko-cestovni-pas-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `cesko-cestovni-pas-view`, and no role
- Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior
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

- [ ] Renders <span> element with class="cesko-cestovni-pas-view"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cesko-cestovni-pas-view in css-style-sheet-template.css
- Companion: CeskoCestovniPasInput
- Wikipedia: https://en.wikipedia.org/wiki/Czech_passport
