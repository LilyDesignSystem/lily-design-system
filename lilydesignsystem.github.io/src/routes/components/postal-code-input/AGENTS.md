# PostalCodeInput

## Metadata

- Component: postal-code-input
- PascalCase: PostalCodeInput
- Description: an input for entering a postal or ZIP code
- Purpose: Collects a postal or ZIP code in one field, with autocomplete and spellcheck off so the number is neither saved by the browser nor sent to a spellchecker. Use it where staff or the person enter that number.
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <input>
- CSS class: .postal-code-input
- Interactive: no

## Companion

- postal-code-view

## Key Behaviors

- Renders a native `<input type="text">` element (not `type="number"`, since postal codes may contain letters or dashes)
- Uses `autocomplete="postal-code"` to hint browser autofill for postal/ZIP code fields
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Supports two-way binding for the `value` prop, enabling two-way `value` binding in the parent
- Supports two-way binding on the `value` prop
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `placeholder`, `pattern`, `maxlength`)

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, bindable) -- current postal code value, supports two-way binding
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Acceptance Criteria

- [ ] Renders <input> element with class="postal-code-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .postal-code-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/postal-code-input.html
- HTML autocomplete attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
- MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
