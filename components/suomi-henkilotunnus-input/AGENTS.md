# SuomiHenkilotunnusInput

## Metadata

- Component: suomi-henkilotunnus-input
- PascalCase: SuomiHenkilotunnusInput
- Description: an input for entering Finland's Henkilötunnus (HETU)
- HTML tag: <input>
- CSS class: .suomi-henkilotunnus-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `suomi-henkilotunnus-input`
- Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum
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

- [ ] Renders <input> element with class="suomi-henkilotunnus-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .suomi-henkilotunnus-input in css-style-sheet-template.css
- Companion: SuomiHenkilotunnusView
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)
