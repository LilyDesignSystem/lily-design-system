# NederlandIdentiteitskaartNummerView

## Metadata

- Component: nederland-identiteitskaart-nummer-view
- PascalCase: NederlandIdentiteitskaartNummerView
- Description: a read-only display of Netherlands's Identiteitskaart Nummer
- HTML tag: <span>
- CSS class: .nederland-identiteitskaart-nummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `nederland-identiteitskaart-nummer-view` and `role="text"`
- Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted
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

- [ ] Renders <span> element with class="nederland-identiteitskaart-nummer-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nederland-identiteitskaart-nummer-view in css-style-sheet-template.css
- Companion: NederlandIdentiteitskaartNummerInput
- Wikipedia: https://en.wikipedia.org/wiki/Dutch_identity_card
