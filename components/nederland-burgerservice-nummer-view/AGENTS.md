# NederlandBurgerserviceNummerView

## Metadata

- Component: nederland-burgerservice-nummer-view
- PascalCase: NederlandBurgerserviceNummerView
- Description: a read-only display of Netherlands's Burgerservicenummer (BSN)
- HTML tag: <span>
- CSS class: .nederland-burgerservice-nummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `nederland-burgerservice-nummer-view` and `role="text"`
- Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm
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

- [ ] Renders <span> element with class="nederland-burgerservice-nummer-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nederland-burgerservice-nummer-view in css-style-sheet-template.css
- Companion: NederlandBurgerserviceNummerInput
- Wikipedia: https://en.wikipedia.org/wiki/Burgerservicenummer
