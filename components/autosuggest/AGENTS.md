# Autosuggest

## Metadata

- Component: autosuggest
- PascalCase: Autosuggest
- Description: a text input that proposes matching options as users type
- Status: beta — implemented and unit-tested in all seven frameworks (Nunjucks renders the markup; opening and the keys are the consumer's script) with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .autosuggest
- Interactive: yes

## Key Behaviors

- Implements the WAI-ARIA combobox pattern with list autocomplete: a `<div class="autosuggest">` root holding an `<input class="autosuggest-input" role="combobox">` and a `<ul class="autosuggest-list" role="listbox">` of `<li class="autosuggest-option" role="option">`
- The consumer computes the suggestions: `onInput` receives the typed query, and the consumer passes the new list back in `suggestions` (filtering or fetching is the consumer's). HTML, Alpine and Web Components take the options as `role="option"` children of the list instead, and re-read them whenever the consumer replaces them
- The component owns the open state, the highlight and the selection
- The list opens when the user types or presses an arrow, and only while there are suggestions; it stays in the DOM, `hidden` while closed, so `aria-controls` always resolves
- Choosing a suggestion (Enter, or a click) writes its `value` into the input, calls `onSelect` with it and closes the list
- Pressing on an option does not blur the input, so a click can choose it
- Closing happens on Escape, blur, or a choice
- Supports two-way binding on the `value` prop

## ARIA

- `role="combobox"` on the input (ARIA 1.2; not on the wrapper), with `aria-autocomplete="list"` and `aria-expanded` reflecting listbox visibility
- `aria-controls` on the input references the listbox id
- `aria-activedescendant` on the input references the highlighted option, and is absent when none is
- `role="listbox"` on the suggestion list (labelled with `label` too), `role="option"` on each suggestion
- The highlighted option has `aria-selected="true"`; the others `"false"`

## Keyboard

- Down arrow: open the listbox and highlight the first option / move the highlight to the next option, wrapping
- Up arrow: open the listbox and highlight the last option / move the highlight to the previous option, wrapping
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
- `name`: string (default: —) — Form field name of the input
- `...restProps`: HTML attributes (default: —) — Spread onto the wrapper `<div>`

## Native platform

- Decision: hand-rolled because <datalist> cannot be styled or hold rich options, and the suggestions come from the consumer as they type
- Uses: none (input role="combobox" + ul role="listbox")
- Could use: <input list>+<datalist>
- Notes: Native <datalist> is a possible zero-JS fallback but cannot be styled or hold rich options.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with class="autosuggest" holding an input combobox and a listbox
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.autosuggest` in css-style-sheet-template.css
- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
