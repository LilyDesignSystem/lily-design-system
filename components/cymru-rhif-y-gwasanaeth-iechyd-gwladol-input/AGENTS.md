# CymruRhifYGwasanaethIechydGwladolInput

## Metadata

- Component: cymru-rhif-y-gwasanaeth-iechyd-gwladol-input
- PascalCase: CymruRhifYGwasanaethIechydGwladolInput
- Description: an input for entering Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG)
- HTML tag: <input>
- CSS class: .cymru-rhif-y-gwasanaeth-iechyd-gwladol-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `cymru-rhif-y-gwasanaeth-iechyd-gwladol-input`
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `aria-label` provided from the `label` prop

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <input> element with class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cymru-rhif-y-gwasanaeth-iechyd-gwladol-input in css-style-sheet-template.css
- Companion: CymruRhifYGwasanaethIechydGwladolView
- Wikipedia: https://en.wikipedia.org/wiki/NHS_number
