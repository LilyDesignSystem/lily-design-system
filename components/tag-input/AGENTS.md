# TagInput

## Metadata

- Component: tag-input
- PascalCase: TagInput
- Description: an input for adding and removing tags
- HTML tag: <div>
- CSS class: .tag-input
- Interactive: yes

## Key Behaviors

- Renders a native `<input type="text">` element for tag entry
- Uses `aria-label` for accessible identification
- Handles Enter key via an `onkeydown` handler that calls `onadd` with the trimmed value and resets the input
- Supports two-way binding on the `value` prop
- Supports `disabled` state to prevent interaction
- Spreads `restProps` onto the input for consumer customization

## ARIA

- `aria-label={label}` -- provides an accessible name for the text input

## Keyboard

- Enter: When the input has a non-empty trimmed value, prevents default form submission, calls `onadd` with the trimmed value, and clears the input

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- current input text; bindable with two-way `value` binding
- `onadd`: `(value: string) => void` (optional) -- callback fired when Enter is pressed with a non-empty trimmed value
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="tag-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tag-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tag-input.html
- WAI-ARIA textbox role (implicit via input type="text"): https://www.w3.org/TR/wai-aria-1.2/#textbox
