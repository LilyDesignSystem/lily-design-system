# TreeSelect

## Metadata

- Component: tree-select
- PascalCase: TreeSelect
- Description: a select dropdown showing a tree of hierarchical options
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .tree-select
- Interactive: yes

## Key Behaviors

- Renders <div role="combobox" aria-haspopup="tree" aria-expanded aria-label> as container
- Trigger is a native <button class="tree-select-trigger" type="button">
- Panel is a <div class="tree-select-panel"> `popover="manual"`, shown while `expanded` (the hidden attribute where the Popover API is missing)
- label prop is REQUIRED and sets aria-label on the combobox
- multiple prop sets data-multiple="true" on the combobox when true (aria-multiselectable is not valid on a combobox; the consumer's role="tree" carries it)
- disabled disables the trigger button
- Children typically include TreeNav/TreeList

## ARIA

- role="combobox" on the container
- aria-haspopup="tree"
- aria-expanded reflects expanded prop
- aria-label is the accessible name (required)
- data-multiple="true" only when multiple is true; no aria-multiselectable on the combobox

## Keyboard

- Tab: Focus the trigger
- Enter / Space: Toggle the panel (consumer handler)
- Arrow keys: Consumer-supplied tree navigation
- Escape: Consumer-supplied close + restore focus

## Props

- `label`: string (REQUIRED)
- `expanded`: boolean (default: false)
- `disabled`: boolean (default: false)
- `multiple`: boolean (default: false)
- `placeholder`: string (optional)
- `value`: string (optional)
- `onclick` / `onClick`: callback (optional)
- `children`: slot — tree content
- `...restProps`: any additional HTML attributes

## Native platform

- Decision: native
- Uses: native <button> trigger; panel div popover="manual" shown from the expanded state
- Could use: CSS anchor positioning to the trigger (theme)
- Notes: P16-T4 (2026-10-31): in Svelte, React, Vue, HTML, Alpine and Web Components, and Angular and Blazor where the component has the state (Angular: combobox, mentions-input, popconfirm-dialog, tree-select; Blazor: combobox; the rest are static stubs), always rendered with popover="manual". Nunjucks keeps the hidden attribute: its macros render the state on the server and have no script to call showPopover(), and a manual popover cannot be open in server-rendered HTML. Always rendered with popover="manual" and opened by the state through Popover/popover.ts, with the hidden attribute where the Popover API is missing (jsdom, older engines). Top layer removes z-index and overflow clipping; Escape and light dismiss stay the consumer's. As cascader: an APG tree has no native element.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> with class="tree-select"
- [ ] role="combobox" and aria-haspopup="tree" are present
- [ ] aria-expanded reflects the expanded prop
- [ ] aria-label equals the label prop
- [ ] data-multiple="true" set only when multiple is true
- [ ] Trigger button has type="button" and respects disabled
- [ ] Panel is hidden when expanded is false
- [ ] Children render inside the panel
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tree-select in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tree-select.html
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WAI-ARIA Tree Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- Ant Design TreeSelect: https://ant.design/components/tree-select
