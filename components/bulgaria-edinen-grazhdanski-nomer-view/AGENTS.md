# BulgariaEdinenGrazhdanskiNomerView

## Metadata

- Component: bulgaria-edinen-grazhdanski-nomer-view
- PascalCase: BulgariaEdinenGrazhdanskiNomerView
- Description: a read-only display of Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .bulgaria-edinen-grazhdanski-nomer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `bulgaria-edinen-grazhdanski-nomer-view`, and no role
- Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit
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

- [ ] Renders <span> element with class="bulgaria-edinen-grazhdanski-nomer-view"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .bulgaria-edinen-grazhdanski-nomer-view in css-style-sheet-template.css
- Companion: BulgariaEdinenGrazhdanskiNomerInput
- Wikipedia: https://en.wikipedia.org/wiki/Unique_citizenship_number
