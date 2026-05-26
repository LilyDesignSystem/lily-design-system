# PolskaNumerIdentyfikacjiPodatkowejInput

## Metadata

- Component: polska-numer-identyfikacji-podatkowej-input
- PascalCase: PolskaNumerIdentyfikacjiPodatkowejInput
- Description: an input for entering Poland's Numer Identyfikacji Podatkowej (NIP)
- HTML tag: <input>
- CSS class: .polska-numer-identyfikacji-podatkowej-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `polska-numer-identyfikacji-podatkowej-input`
- Format: 10 numeric digits used for tax identification
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

- [ ] Renders <input> element with class="polska-numer-identyfikacji-podatkowej-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .polska-numer-identyfikacji-podatkowej-input in css-style-sheet-template.css
- Companion: PolskaNumerIdentyfikacjiPodatkowejView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Poland
