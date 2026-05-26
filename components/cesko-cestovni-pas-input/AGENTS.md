# CeskoCestovniPasInput

## Metadata

- Component: cesko-cestovni-pas-input
- PascalCase: CeskoCestovniPasInput
- Description: an input for entering Czech Republic's Cestovní pas
- HTML tag: <input>
- CSS class: .cesko-cestovni-pas-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `cesko-cestovni-pas-input`
- Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior
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

- [ ] Renders <input> element with class="cesko-cestovni-pas-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cesko-cestovni-pas-input in css-style-sheet-template.css
- Companion: CeskoCestovniPasView
- Wikipedia: https://en.wikipedia.org/wiki/Czech_passport
