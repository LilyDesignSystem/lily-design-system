# SelectWithExtras

## Metadata

- Component: select-with-extras
- PascalCase: SelectWithExtras
- Description: a select dropdown with additional features like search or groups
- HTML tag: <div>
- CSS class: .select-with-extras
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing optional `before` slot, a native `<select>`, and optional `after` slot
- The `<select>` element receives `aria-label` for accessibility, with two-way binding
- Supports `required` and `disabled` attributes on the native select
- Supports two-way binding for the `value` prop, enabling two-way `value` binding from the parent
- The `before` and `after` slots are conditionally rendered only when provided
- Spreads `restProps` onto the wrapper div for consumer customization

## ARIA

- `aria-label={label}` -- provides an accessible name for the select element so screen readers announce its purpose

## Keyboard

- Tab: Moves focus to the native select element
- Arrow Up / Arrow Down: Navigates between options (native select behavior)
- Space / Enter: Opens the select dropdown on some platforms (native select behavior)
- Escape: Closes the dropdown if open (native select behavior)

## Props

- `label`: string (required) -- accessible label for the select element, applied via `aria-label`
- `value`: string (default: `""`) -- the currently selected value; two-way bindable via `value`
- `required`: boolean (default: `false`) -- whether the select is required for form validation
- `disabled`: boolean (default: `false`) -- whether the select is disabled
- `children`: slot (required) -- `<option>` elements for the select
- `before`: slot (optional) -- content rendered before the select element
- `after`: slot (optional) -- content rendered after the select element
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="select-with-extras"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .select-with-extras in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/select-with-extras.html
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- HTML `<select>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
