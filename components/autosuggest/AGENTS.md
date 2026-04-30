# Autosuggest

## Metadata

- Component: autosuggest
- PascalCase: Autosuggest
- Description: a text input that proposes matching options as users type
- HTML tag: <div>
- CSS class: .autosuggest
- Interactive: yes

## Key Behaviors

- Implements the WAI-ARIA Combobox pattern (combobox + listbox + option) atop a text `<input>`
- Suggestions are produced by the consumer via the `onInput` callback (which receives the typed query and returns a list of options)
- Selecting a suggestion sets the input value and closes the listbox
- Supports two-way binding on the `value` prop
- Listbox is rendered only when there are suggestions and the input is focused
- Closing happens on Escape, click outside, blur, or successful selection

## ARIA

- `role="combobox"` on the wrapper, `aria-expanded` toggled to reflect listbox visibility
- `aria-controls` on the input references the listbox id
- `aria-activedescendant` on the input references the currently highlighted option
- `role="listbox"` on the suggestion list, `role="option"` on each suggestion
- Selected option has `aria-selected="true"`

## Keyboard

- Down arrow: open the listbox / move highlight to the next option
- Up arrow: move highlight to the previous option
- Enter: select the highlighted option
- Escape: close the listbox without selecting
- Home / End: jump to the first / last option (when listbox is open)

## Props

- `label`: string (required) (default: —) — Accessible name for the input
- `value`: string (default: "") — Bindable input value
- `suggestions`: array of `{ value: string; label: string }` (default: []) — Current suggestions to show
- `onInput`: (query: string) => void (default: —) — Fired when the typed value changes; consumer recomputes suggestions
- `onSelect`: (value: string) => void (default: —) — Fired when the user selects a suggestion
- `placeholder`: string (default: —) — Placeholder text
- `...restProps`: HTML attributes (default: —) — Spread onto the wrapper `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="autosuggest"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.autosuggest` in css-style-sheet-template.css
- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
