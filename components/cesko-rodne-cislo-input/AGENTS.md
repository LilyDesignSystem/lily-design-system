# CeskoRodneCisloInput

## Metadata

- Component: cesko-rodne-cislo-input
- PascalCase: CeskoRodneCisloInput
- Description: an input for entering Czech Republic's Rodné číslo (RČ)
- HTML tag: <input>
- CSS class: .cesko-rodne-cislo-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `cesko-rodne-cislo-input`
- Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11
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

- [ ] Renders <input> element with class="cesko-rodne-cislo-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cesko-rodne-cislo-input in css-style-sheet-template.css
- Companion: CeskoRodneCisloView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic
