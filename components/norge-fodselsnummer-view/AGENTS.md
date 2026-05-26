# NorgeFodselsnummerView

## Metadata

- Component: norge-fodselsnummer-view
- PascalCase: NorgeFodselsnummerView
- Description: a read-only display of Norway's Fødselsnummer
- HTML tag: <span>
- CSS class: .norge-fodselsnummer-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `norge-fodselsnummer-view` and `role="text"`
- Format: 11 digits where the first 6 represent the date of birth (DDMMYY)
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

- [ ] Renders <span> element with class="norge-fodselsnummer-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .norge-fodselsnummer-view in css-style-sheet-template.css
- Companion: NorgeFodselsnummerInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Norway
