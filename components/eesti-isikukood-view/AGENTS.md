# EestiIsikukoodView

## Metadata

- Component: eesti-isikukood-view
- PascalCase: EestiIsikukoodView
- Description: a read-only display of Estonia's Isikukood (IK)
- HTML tag: <span>
- CSS class: .eesti-isikukood-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `eesti-isikukood-view` and `role="text"`
- Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum
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

- [ ] Renders <span> element with class="eesti-isikukood-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .eesti-isikukood-view in css-style-sheet-template.css
- Companion: EestiIsikukoodInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Estonia
