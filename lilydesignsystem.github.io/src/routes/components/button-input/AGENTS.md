# ButtonInput

## Metadata

- Component: button-input
- PascalCase: ButtonInput
- Description: an input element of type button for form actions <input type="button">
- HTML tag: <input>
- CSS class: .button-input
- Interactive: yes

## Key Behaviors

- Wraps the native `<input type="button">` element for form-native button semantics
- Label is the `value` attribute (plain text only, no rich content)
- Distinguished from the Button component: Button uses `<button>` with children slots
- Uses props rune for prop destructuring
- Spreads `...restProps` on the `<input>` element for consumer extensibility
- Supports `disabled`, `name`, and `onclick` for standard form interactions
- No hardcoded user-facing strings; label text comes through `value` and `label` props

## ARIA

- Implicit `button` role -- provided natively by `<input type="button">`
- `aria-label={label}` -- optional screen reader label override; when provided, screen readers announce this instead of the `value` text
- `aria-disabled` -- implicitly managed by the native `disabled` attribute

## Keyboard

- Tab: Focus the button input
- Enter: Activate the button (native behavior)
- Space: Activate the button (native behavior)

## Props

- `value`: string (required) -- the button label text displayed on the input
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `name`: string (optional) -- form field name for form submission
- `label`: string (optional) -- accessible label override via `aria-label` for screen readers
- `onclick`: `(event: MouseEvent) => void` (optional) -- click event handler
- `...restProps`: any additional HTML attributes spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="button-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .button-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/button-input.html
- MDN input type="button": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
