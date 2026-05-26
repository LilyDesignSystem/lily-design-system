# SlovenskoPasView

## Metadata

- Component: slovensko-pas-view
- PascalCase: SlovenskoPasView
- Description: a read-only display of Slovakia's Pas
- HTML tag: <span>
- CSS class: .slovensko-pas-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `slovensko-pas-view` and `role="text"`
- Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years
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

- [ ] Renders <span> element with class="slovensko-pas-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slovensko-pas-view in css-style-sheet-template.css
- Companion: SlovenskoPasInput
- Wikipedia: https://en.wikipedia.org/wiki/Slovak_passport
