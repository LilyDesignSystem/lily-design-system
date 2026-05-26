# LatvijaPersonasKodsInput

## Metadata

- Component: latvija-personas-kods-input
- PascalCase: LatvijaPersonasKodsInput
- Description: an input for entering Latvia's Personas kods
- HTML tag: <input>
- CSS class: .latvija-personas-kods-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `latvija-personas-kods-input`
- Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st)
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

- [ ] Renders <input> element with class="latvija-personas-kods-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .latvija-personas-kods-input in css-style-sheet-template.css
- Companion: LatvijaPersonasKodsView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Latvia
