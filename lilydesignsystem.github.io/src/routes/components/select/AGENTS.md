# Select

## Metadata

- Component: select
- PascalCase: Select
- Description: a dropdown select element for choosing one option
- HTML tag: <select>
- CSS class: .select
- Interactive: yes

## Key Behaviors

- Renders a single `<select>` element containing consumer-provided `<option>` children
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Supports two-way binding on the `value` prop
- Uses slot for the `children` prop to render `<option>` elements
- Spreads `restProps` onto the select element for consumer extensibility

## ARIA

- `aria-label={label}` -- provides an accessible name for the select element since there is no visible `<label>` element
- The `<select>` element implicitly has `role="combobox"` or `role="listbox"` depending on the browser, with built-in accessible semantics

## Keyboard

- Tab: Moves focus to and from the select element (native browser behavior)
- Space/Enter: Opens the dropdown list when focused (native browser behavior)
- Arrow Up/Down: Navigates through options (native browser behavior)
- Escape: Closes the dropdown list (native browser behavior)
- Home/End: Jumps to first/last option (native browser behavior)
- Type-ahead: Typing characters jumps to matching options (native browser behavior)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- bindable string representing the currently selected value
- `required`: boolean (default: false) -- whether the select is required for form submission
- `disabled`: boolean (default: false) -- whether the select is disabled
- `children`: slot (required) -- `<option>` elements to render inside the select
- `...restProps`: unknown -- additional attributes spread onto the select element

## Acceptance Criteria

- [ ] Renders <select> element with class="select"
- [ ] Has aria-label attribute
- [ ] Has role="combobox"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .select in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/select.html
- MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
