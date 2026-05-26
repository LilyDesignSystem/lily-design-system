# BulgariaEdinenGrazhdanskiNomerView

## Metadata

- Component: bulgaria-edinen-grazhdanski-nomer-view
- PascalCase: BulgariaEdinenGrazhdanskiNomerView
- Description: a read-only display of Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)
- HTML tag: <span>
- CSS class: .bulgaria-edinen-grazhdanski-nomer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `bulgaria-edinen-grazhdanski-nomer-view` and `role="text"`
- Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit
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

- [ ] Renders <span> element with class="bulgaria-edinen-grazhdanski-nomer-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .bulgaria-edinen-grazhdanski-nomer-view in css-style-sheet-template.css
- Companion: BulgariaEdinenGrazhdanskiNomerInput
- Wikipedia: https://en.wikipedia.org/wiki/Unique_citizenship_number
