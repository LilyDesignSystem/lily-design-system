# TreeSelect

## Metadata

- Component: tree-select
- PascalCase: TreeSelect
- Description: a select dropdown showing a tree of hierarchical options
- HTML tag: <div>
- CSS class: .tree-select
- Interactive: yes

## Key Behaviors

- Renders <div role="combobox" aria-haspopup="tree" aria-expanded aria-label> as container
- Trigger is a native <button class="tree-select-trigger" type="button">
- Panel is a <div class="tree-select-panel"> toggled with the hidden attribute
- label prop is REQUIRED and sets aria-label on the combobox
- multiple prop sets aria-multiselectable="true" when true
- disabled disables the trigger button
- Children typically include TreeNav/TreeList

## ARIA

- role="combobox" on the container
- aria-haspopup="tree"
- aria-expanded reflects expanded prop
- aria-label is the accessible name (required)
- aria-multiselectable="true" only when multiple is true

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

## Acceptance Criteria

- [ ] Renders <div> with class="tree-select"
- [ ] role="combobox" and aria-haspopup="tree" are present
- [ ] aria-expanded reflects the expanded prop
- [ ] aria-label equals the label prop
- [ ] aria-multiselectable="true" set only when multiple is true
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
