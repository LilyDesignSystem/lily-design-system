# EnglandNationalHealthServiceNumberView

## Metadata

- Component: england-national-health-service-number-view
- PascalCase: EnglandNationalHealthServiceNumberView
- Description: a read-only display of England's National Health Service Number (NHS)
- HTML tag: <span>
- CSS class: .england-national-health-service-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `england-national-health-service-number-view` and `role="text"`
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service
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

- [ ] Renders <span> element with class="england-national-health-service-number-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .england-national-health-service-number-view in css-style-sheet-template.css
- Companion: EnglandNationalHealthServiceNumberInput
- Wikipedia: https://en.wikipedia.org/wiki/NHS_number
