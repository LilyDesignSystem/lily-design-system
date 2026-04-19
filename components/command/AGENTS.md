# Command

## Metadata

- Component: command
- PascalCase: Command
- Description: a command palette for searching and executing actions
- HTML tag: <div>
- CSS class: .command
- Interactive: yes

## Key Behaviors

- Wraps content in a `<div>` with `role="search"` and `aria-label` for semantic search region
- Contains an `<input type="search">` with `autocomplete="off"` to prevent browser autocomplete interference
- Contains a `<div>` with `role="listbox"` for displaying filtered results
- Supports two-way binding on the `value` prop component
- Children slot is rendered inside the listbox for consumer-controlled list items
- Spreads `restProps` on the outer search container

## ARIA

- `role="search"` -- identifies the outer container as a search landmark region
- `aria-label={label}` -- provides accessible name for the search region and input
- `role="listbox"` -- identifies the results container as a listbox for selectable options
- `aria-label={label}` -- provides accessible name for the listbox

## Keyboard

- **Tab**: Moves focus into and out of the search input
- Additional keyboard navigation (arrow keys within the listbox) should be implemented by the consumer

## Props

- `label`: string (required) -- accessible name for both the search region and the input
- `placeholder`: string (default: `undefined`) -- placeholder text for the search input
- `value`: string (default: `""`, bindable) -- current search text, supports two-way binding via two-way `value` binding
- `children`: slot (required) -- listbox content, typically option or command items
- `...restProps`: any additional HTML attributes spread onto the outer `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="command"
- [ ] Has aria-label attribute
- [ ] Has role="search"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .command in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/command.html
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
