# Command

## Metadata

- Component: command
- PascalCase: Command
- Description: a command palette for searching and executing actions
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
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

- Tab: Moves focus into and out of the search input
- ArrowDown, ArrowUp: move the highlight and wrap; focus stays in the input
- Home, End: jump to the first or last option, once one is highlighted; before that they stay the input's
- Enter: clicks the highlighted option; with none highlighted it is left alone
- Escape: drops the highlight; with none highlighted it is left alone, so an enclosing dialog still gets it
- A key during IME composition belongs to the IME

The highlighted option is `aria-activedescendant` on the input, with `aria-selected` and `data-active` on the option. Filtering, and what an option does, are the consumer's. From `shared/command-keys.ts`, held to the `command` contract.

## Props

- `label`: string (required) -- accessible name for both the search region and the input
- `placeholder`: string (default: `undefined`) -- placeholder text for the search input
- `value`: string (default: `""`, bindable) -- current search text, supports two-way binding via two-way `value` binding
- `children`: slot (required) -- listbox content, typically option or command items
- `...restProps`: any additional HTML attributes spread onto the outer `<div>`

## Native platform

- Decision: hand-rolled because a filtered listbox driven from a search input has no native element
- Uses: native <input> in div role="search"; div role="listbox"
- Could use: <dialog> showModal() around it for a Ctrl+K palette
- Notes: Not an overlay; compose with dialog for the palette case.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

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
