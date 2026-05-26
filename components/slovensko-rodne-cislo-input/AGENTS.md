# SlovenskoRodneCisloInput

## Metadata

- Component: slovensko-rodne-cislo-input
- PascalCase: SlovenskoRodneCisloInput
- Description: an input for entering Slovakia's Rodné číslo (RČ)
- HTML tag: <input>
- CSS class: .slovensko-rodne-cislo-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `slovensko-rodne-cislo-input`
- Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11
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

- [ ] Renders <input> element with class="slovensko-rodne-cislo-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slovensko-rodne-cislo-input in css-style-sheet-template.css
- Companion: SlovenskoRodneCisloView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Slovakia
