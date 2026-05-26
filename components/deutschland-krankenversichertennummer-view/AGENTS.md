# DeutschlandKrankenversichertennummerView

## Metadata

- Component: deutschland-krankenversichertennummer-view
- PascalCase: DeutschlandKrankenversichertennummerView
- Description: a read-only display of Germany's Krankenversichertennummer (KVNR)
- HTML tag: <span>
- CSS class: .deutschland-krankenversichertennummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `deutschland-krankenversichertennummer-view` and `role="text"`
- Format: a random capital letter followed by eight random digits and a Luhn check digit
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

- [ ] Renders <span> element with class="deutschland-krankenversichertennummer-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .deutschland-krankenversichertennummer-view in css-style-sheet-template.css
- Companion: DeutschlandKrankenversichertennummerInput
- Wikipedia: https://de.wikipedia.org/wiki/Krankenversichertennummer
