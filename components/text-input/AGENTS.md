# TextInput

## Metadata

- Component: text-input
- PascalCase: TextInput
- Description: a single-line text input field <input type="text">
- HTML tag: <input>
- CSS class: .text-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="text">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Supports two-way binding for the `value` prop, enabling two-way `value` binding in the parent
- Supports two-way binding on the `value` prop
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `placeholder`, `maxlength`, `pattern`)

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, bindable) -- current text value, supports two-way binding
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Acceptance Criteria

- [ ] Renders <input> element with class="text-input"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .text-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/text-input.html
- MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
