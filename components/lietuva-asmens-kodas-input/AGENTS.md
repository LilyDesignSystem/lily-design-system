# LietuvaAsmensKodasInput

## Metadata

- Component: lietuva-asmens-kodas-input
- PascalCase: LietuvaAsmensKodasInput
- Description: an input for entering Lithuania's Asmens kodas
- HTML tag: <input>
- CSS class: .lietuva-asmens-kodas-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `lietuva-asmens-kodas-input`
- Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit
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

- [ ] Renders <input> element with class="lietuva-asmens-kodas-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .lietuva-asmens-kodas-input in css-style-sheet-template.css
- Companion: LietuvaAsmensKodasView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Lithuania
