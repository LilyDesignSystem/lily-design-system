# PortugalPassaporteInput

## Metadata

- Component: portugal-passaporte-input
- PascalCase: PortugalPassaporteInput
- Description: an input for entering Portugal's Passaporte
- HTML tag: <input>
- CSS class: .portugal-passaporte-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `portugal-passaporte-input`
- Format: 1 letter [A-Z] and 6 digits [0-9]
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

- [ ] Renders <input> element with class="portugal-passaporte-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .portugal-passaporte-input in css-style-sheet-template.css
- Companion: PortugalPassaporteView
- Wikipedia: https://en.wikipedia.org/wiki/Portuguese_passport
