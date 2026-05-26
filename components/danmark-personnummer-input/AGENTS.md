# DanmarkPersonnummerInput

## Metadata

- Component: danmark-personnummer-input
- PascalCase: DanmarkPersonnummerInput
- Description: an input for entering Denmark's Personnummer (CPR-nummer) (CPR)
- HTML tag: <input>
- CSS class: .danmark-personnummer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `danmark-personnummer-input`
- Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY)
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

- [ ] Renders <input> element with class="danmark-personnummer-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .danmark-personnummer-input in css-style-sheet-template.css
- Companion: DanmarkPersonnummerView
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)
