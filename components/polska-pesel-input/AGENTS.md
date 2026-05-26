# PolskaPeselInput

## Metadata

- Component: polska-pesel-input
- PascalCase: PolskaPeselInput
- Description: an input for entering Poland's PESEL
- HTML tag: <input>
- CSS class: .polska-pesel-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `polska-pesel-input`
- Format: 11 numeric digits; assigned shortly after birth and unchanged for life
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

- [ ] Renders <input> element with class="polska-pesel-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .polska-pesel-input in css-style-sheet-template.css
- Companion: PolskaPeselView
- Wikipedia: https://en.wikipedia.org/wiki/PESEL
