# SlovenskoPasInput

## Metadata

- Component: slovensko-pas-input
- PascalCase: SlovenskoPasInput
- Description: an input for entering Slovakia's Pas
- HTML tag: <input>
- CSS class: .slovensko-pas-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `slovensko-pas-input`
- Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years
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

- [ ] Renders <input> element with class="slovensko-pas-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slovensko-pas-input in css-style-sheet-template.css
- Companion: SlovenskoPasView
- Wikipedia: https://en.wikipedia.org/wiki/Slovak_passport
