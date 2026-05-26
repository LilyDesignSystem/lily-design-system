# BulgariaEdinenGrazhdanskiNomerInput

## Metadata

- Component: bulgaria-edinen-grazhdanski-nomer-input
- PascalCase: BulgariaEdinenGrazhdanskiNomerInput
- Description: an input for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)
- HTML tag: <input>
- CSS class: .bulgaria-edinen-grazhdanski-nomer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `bulgaria-edinen-grazhdanski-nomer-input`
- Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit
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

- [ ] Renders <input> element with class="bulgaria-edinen-grazhdanski-nomer-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .bulgaria-edinen-grazhdanski-nomer-input in css-style-sheet-template.css
- Companion: BulgariaEdinenGrazhdanskiNomerView
- Wikipedia: https://en.wikipedia.org/wiki/Unique_citizenship_number
