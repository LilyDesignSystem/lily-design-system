# SverigePersonnummerView

## Metadata

- Component: sverige-personnummer-view
- PascalCase: SverigePersonnummerView
- Description: a read-only display of Sweden's Personnummer
- HTML tag: <span>
- CSS class: .sverige-personnummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `sverige-personnummer-view` and `role="text"`
- Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit
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

- [ ] Renders <span> element with class="sverige-personnummer-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .sverige-personnummer-view in css-style-sheet-template.css
- Companion: SverigePersonnummerInput
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)
