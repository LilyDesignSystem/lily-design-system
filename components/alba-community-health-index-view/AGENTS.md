# AlbaCommunityHealthIndexView

## Metadata

- Component: alba-community-health-index-view
- PascalCase: AlbaCommunityHealthIndexView
- Description: a read-only display of Scotland's Community Health Index (CHI)
- HTML tag: <span>
- CSS class: .alba-community-health-index-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `alba-community-health-index-view` and `role="text"`
- Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit
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

- [ ] Renders <span> element with class="alba-community-health-index-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .alba-community-health-index-view in css-style-sheet-template.css
- Companion: AlbaCommunityHealthIndexInput
- Wikipedia: https://en.wikipedia.org/wiki/National_Health_Service_Central_Register
