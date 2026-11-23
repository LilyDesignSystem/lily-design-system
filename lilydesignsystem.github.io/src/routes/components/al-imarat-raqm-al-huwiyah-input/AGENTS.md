# AlImaratRaqmAlHuwiyahInput

## Metadata

- Component: al-imarat-raqm-al-huwiyah-input
- PascalCase: AlImaratRaqmAlHuwiyahInput
- Description: an input for entering the United Arab Emirates' Emirates ID number
- Purpose: Collects the United Arab Emirates' Emirates ID number in one field, with autocomplete and spellcheck off so the number is neither saved by the browser nor sent to a spellchecker. Use it where staff or the person enter that number.
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .al-imarat-raqm-al-huwiyah-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `al-imarat-raqm-al-huwiyah-input`
- Format: Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <input> element with class="al-imarat-raqm-al-huwiyah-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .al-imarat-raqm-al-huwiyah-input in css-style-sheet-template.css
- Companion: AlImaratRaqmAlHuwiyahView
- [Emirates ID](https://en.wikipedia.org/wiki/Emirates_ID)
- [Microsoft Purview: U.A.E. identity card number](https://learn.microsoft.com/en-us/purview/sit-defn-uae-identity-card-number)
