# AlbaCommunityHealthIndexInput

## Metadata

- Component: alba-community-health-index-input
- PascalCase: AlbaCommunityHealthIndexInput
- Description: an input for entering Scotland's Community Health Index (CHI)
- HTML tag: <input>
- CSS class: .alba-community-health-index-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `alba-community-health-index-input`
- Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit
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

- [ ] Renders <input> element with class="alba-community-health-index-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .alba-community-health-index-input in css-style-sheet-template.css
- Companion: AlbaCommunityHealthIndexView
- Wikipedia: https://en.wikipedia.org/wiki/National_Health_Service_Central_Register
