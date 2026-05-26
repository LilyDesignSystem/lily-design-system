# SverigePersonnummerInput

## Metadata

- Component: sverige-personnummer-input
- PascalCase: SverigePersonnummerInput
- Description: an input for entering Sweden's Personnummer
- HTML tag: <input>
- CSS class: .sverige-personnummer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `sverige-personnummer-input`
- Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit
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

- [ ] Renders <input> element with class="sverige-personnummer-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .sverige-personnummer-input in css-style-sheet-template.css
- Companion: SverigePersonnummerView
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)
