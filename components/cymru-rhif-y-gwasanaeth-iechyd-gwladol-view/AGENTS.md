# CymruRhifYGwasanaethIechydGwladolView

## Metadata

- Component: cymru-rhif-y-gwasanaeth-iechyd-gwladol-view
- PascalCase: CymruRhifYGwasanaethIechydGwladolView
- Description: a read-only display of Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG)
- HTML tag: <span>
- CSS class: .cymru-rhif-y-gwasanaeth-iechyd-gwladol-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `cymru-rhif-y-gwasanaeth-iechyd-gwladol-view` and `role="text"`
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man)
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

- [ ] Renders <span> element with class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cymru-rhif-y-gwasanaeth-iechyd-gwladol-view in css-style-sheet-template.css
- Companion: CymruRhifYGwasanaethIechydGwladolInput
- Wikipedia: https://en.wikipedia.org/wiki/NHS_number
