# Combobox

## Metadata

- Component: combobox
- PascalCase: Combobox
- Description: a text input combined with a dropdown list for filtering options
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .combobox
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing an `<input>` with `role="combobox"` and an always-rendered `<div popover="manual">` with `role="listbox"`.
- Generates a unique `listboxId` using random string for the `aria-controls` relationship between input and listbox.
- The `value` prop uses two-way binding of the input text.
- The `open` prop uses two-way binding of dropdown visibility.
- The listbox is `display: none` while closed (Popover API, or the `hidden` attribute where it is missing), so it stays a valid `aria-controls` target.
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

## Native platform

- Decision: native
- Uses: native <input role="combobox">; listbox div popover="manual" shown from the open state
- Could use: CSS anchor positioning to the input (theme)
- Notes: P16-T4 (2026-10-31): in Svelte, React, Vue, HTML, Alpine and Web Components, and Angular and Blazor where the component has the state (Angular: combobox, mentions-input, popconfirm-dialog, tree-select; Blazor: combobox; the rest are static stubs), always rendered with popover="manual". Nunjucks keeps the hidden attribute: its macros render the state on the server and have no script to call showPopover(), and a manual popover cannot be open in server-rendered HTML. Always rendered with popover="manual" and opened by the state through Popover/popover.ts, with the hidden attribute where the Popover API is missing (jsdom, older engines). Top layer removes z-index and overflow clipping; Escape and light dismiss stay the consumer's. APG combobox keeps focus in the input and moves aria-activedescendant through options; <datalist> cannot do that, cannot hold rich options, and screen-reader support varies. manual, because auto light dismiss would fight the input keeping focus.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

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
