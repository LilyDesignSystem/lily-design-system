# NorgeFodselsnummerInput

## Metadata

- Component: norge-fodselsnummer-input
- PascalCase: NorgeFodselsnummerInput
- Description: an input for entering Norway's Fødselsnummer
- Purpose: Collects Norway's Fødselsnummer in one field, with autocomplete and spellcheck off so the number is neither saved by the browser nor sent to a spellchecker. Use it where staff or the person enter that number.
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <input>
- CSS class: .norge-fodselsnummer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `norge-fodselsnummer-input`
- Format: 11 digits where the first 6 represent the date of birth (DDMMYY)
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

- [ ] Renders <input> element with class="norge-fodselsnummer-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .norge-fodselsnummer-input in css-style-sheet-template.css
- Companion: NorgeFodselsnummerView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Norway
