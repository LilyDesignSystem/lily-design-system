# Combobox

## Metadata

- Component: combobox
- PascalCase: Combobox
- Description: a text input combined with a dropdown list for filtering options
- HTML tag: <div>
- CSS class: .combobox
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing an `<input>` with `role="combobox"` and a conditionally rendered `<div>` with `role="listbox"`.
- Generates a unique `listboxId` using random string for the `aria-controls` relationship between input and listbox.
- The `value` prop uses two-way binding of the input text.
- The `open` prop uses two-way binding of dropdown visibility.
- The listbox is conditionally rendered with conditional rendering to hide it from the DOM when closed.
- Escape key closes the dropdown via an `onkeydown` handler on the input.
- Spreads `restProps` onto the outer wrapper `<div>`.

## ARIA

- `role="combobox"` -- on the `<input>`, identifies it as a combobox widget.
- `aria-label` -- provides an accessible name for both the input and the listbox.
- `aria-expanded` -- reflects the `open` state, telling screen readers whether the dropdown is visible.
- `aria-controls` -- links the input to its associated listbox by ID.
- `aria-autocomplete="list"` -- indicates the input provides autocomplete suggestions via a list.
- `role="listbox"` -- on the dropdown container, identifies it as a list of selectable options.

## Keyboard

- Escape: Closes the dropdown listbox.

## Props

- `label`: string (required) -- accessible name applied via `aria-label` on both the input and listbox.
- `value`: string (default: `""`) -- bindable current text input value.
- `open`: boolean (default: `false`) -- bindable dropdown visibility state.
- `children`: slot (required) -- option elements rendered inside the listbox dropdown.
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`.

## Acceptance Criteria

- [ ] Renders <div> element with class="combobox"
- [ ] Has aria-label attribute
- [ ] Has role="combobox"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .combobox in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/combobox.html
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
