# NederlandIdentiteitskaartNummerInput

## Metadata

- Component: nederland-identiteitskaart-nummer-input
- PascalCase: NederlandIdentiteitskaartNummerInput
- Description: an input for entering Netherlands's Identiteitskaart Nummer
- HTML tag: <input>
- CSS class: .nederland-identiteitskaart-nummer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `nederland-identiteitskaart-nummer-input`
- Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted
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

- [ ] Renders <input> element with class="nederland-identiteitskaart-nummer-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nederland-identiteitskaart-nummer-input in css-style-sheet-template.css
- Companion: NederlandIdentiteitskaartNummerView
- Wikipedia: https://en.wikipedia.org/wiki/Dutch_identity_card
