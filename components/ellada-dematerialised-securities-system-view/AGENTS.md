# ElladaDematerialisedSecuritiesSystemView

## Metadata

- Component: ellada-dematerialised-securities-system-view
- PascalCase: ElladaDematerialisedSecuritiesSystemView
- Description: a read-only display of Greece's Dematerialised Securities System (DSS)
- HTML tag: <span>
- CSS class: .ellada-dematerialised-securities-system-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `ellada-dematerialised-securities-system-view` and `role="text"`
- Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece
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

- [ ] Renders <span> element with class="ellada-dematerialised-securities-system-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .ellada-dematerialised-securities-system-view in css-style-sheet-template.css
- Companion: ElladaDematerialisedSecuritiesSystemInput
- Wikipedia: https://en.wikipedia.org/wiki/Central_Securities_Depository
