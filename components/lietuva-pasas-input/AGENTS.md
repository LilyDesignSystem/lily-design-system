# LietuvaPasasInput

## Metadata

- Component: lietuva-pasas-input
- PascalCase: LietuvaPasasInput
- Description: an input for entering Lithuania's Pasas
- HTML tag: <input>
- CSS class: .lietuva-pasas-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `lietuva-pasas-input`
- Format: 8-digit passport or identity card number
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

- [ ] Renders <input> element with class="lietuva-pasas-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .lietuva-pasas-input in css-style-sheet-template.css
- Companion: LietuvaPasasView
- Wikipedia: https://en.wikipedia.org/wiki/Lithuanian_passport
