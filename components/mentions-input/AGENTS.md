# MentionsInput

## Metadata

- Component: mentions-input
- PascalCase: MentionsInput
- Description: a text input with at-mention autocomplete suggestions
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .mentions-input
- Interactive: yes

## Key Behaviors

- Renders <div class="mentions-input" data-trigger-char={triggerChar}> container
- Inner <input class="mentions-input-control" type="text" role="combobox"> with ARIA attrs
- Suggestions <div class="mentions-input-suggestions"> `popover="manual"`, shown while `expanded` (the hidden attribute where the Popover API is missing)
- label prop is REQUIRED and applied as aria-label on the input
- triggerChar defaults to "@"
- disabled disables the input
- Consumer supplies listbox markup as children

## ARIA

- Input has role="combobox", aria-haspopup="listbox", aria-expanded, aria-autocomplete="list", and aria-controls pointing at the suggestions panel's id (generated: React/Vue/Svelte `useId`, Web Components `nextId`; Nunjucks `{id}-suggestions`, default `mentions-input-suggestions`). The Angular and Blazor ports are minimal stubs without the panel and do not yet implement the combobox pattern
- aria-label is the input's accessible name (required)
- Consumer listbox uses role="listbox" with role="option" children

## Keyboard

- Tab: Focus the input
- Trigger character: Opens the list, except inside a Latin word such as an email address; text written without spaces, such as Chinese or Japanese, still opens it
- ArrowDown, ArrowUp: Move the highlight and wrap, while open; focus stays in the input
- Enter: Writes the highlighted mention at the caret
- Escape: Closes the list
- A key during IME composition belongs to the IME

Filtering is the consumer's, from the query it is told. From `shared/widget-keys.ts`, held to the `mentions` contract.

## Props

- `label`: string (REQUIRED)
- `value`: string (default: "")
- `triggerChar`: string (default: "@")
- `expanded`: boolean (default: false)
- `placeholder`: string (optional)
- `disabled`: boolean (default: false)
- `oninput` / `onInput`: callback (optional)
- `children`: slot — suggestions content
- `...restProps`: any additional HTML attributes

## Native platform

- Decision: native
- Uses: native <input role="combobox">; suggestions div popover="manual" shown from the expanded state
- Could use: CSS anchor positioning to the input (theme)
- Notes: P16-T4 (2026-10-31): in Svelte, React, Vue, HTML, Alpine and Web Components, and Angular and Blazor where the component has the state (Angular: combobox, mentions-input, popconfirm-dialog, tree-select; Blazor: combobox, popconfirm-dialog; the rest are static stubs), always rendered with popover="manual". Nunjucks keeps the hidden attribute: its macros render the state on the server and have no script to call showPopover(), and a manual popover cannot be open in server-rendered HTML. Always rendered with popover="manual" and opened by the state through Popover/popover.ts, with the hidden attribute where the Popover API is missing (jsdom, older engines). Top layer removes z-index and overflow clipping; Escape and light dismiss stay the consumer's. As combobox; anchoring to the caret is not possible with anchor positioning, so placement stays at the input.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div class="mentions-input"> with data-trigger-char
- [ ] Inner <input> has class="mentions-input-control" and type="text"
- [ ] Input has role="combobox", aria-haspopup="listbox", aria-autocomplete="list"
- [ ] aria-expanded reflects the expanded prop
- [ ] aria-label equals the label prop
- [ ] Suggestions panel is hidden when expanded is false
- [ ] disabled attribute is applied to the input when disabled is true
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .mentions-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/mentions-input.html
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Ant Design Mentions: https://ant.design/components/mentions
