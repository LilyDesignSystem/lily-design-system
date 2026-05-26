# HrvatskaOsobniIdentifikacijskiBrojInput

## Metadata

- Component: hrvatska-osobni-identifikacijski-broj-input
- PascalCase: HrvatskaOsobniIdentifikacijskiBrojInput
- Description: an input for entering Croatia's Osobni identifikacijski broj (OIB)
- HTML tag: <input>
- CSS class: .hrvatska-osobni-identifikacijski-broj-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `hrvatska-osobni-identifikacijski-broj-input`
- Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person
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

- [ ] Renders <input> element with class="hrvatska-osobni-identifikacijski-broj-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hrvatska-osobni-identifikacijski-broj-input in css-style-sheet-template.css
- Companion: HrvatskaOsobniIdentifikacijskiBrojView
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)
