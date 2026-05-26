# RomaniaPasaportInput

## Metadata

- Component: romania-pasaport-input
- PascalCase: RomaniaPasaportInput
- Description: an input for entering Romania's Paşaport
- HTML tag: <input>
- CSS class: .romania-pasaport-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `romania-pasaport-input`
- Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9]
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

- [ ] Renders <input> element with class="romania-pasaport-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .romania-pasaport-input in css-style-sheet-template.css
- Companion: RomaniaPasaportView
- Wikipedia: https://en.wikipedia.org/wiki/Romanian_passport
