# TreeMenu

## Metadata

- Component: tree-menu
- PascalCase: TreeMenu
- Description: a hierarchical tree menu with expandable branches
- Status: beta — implemented with key tests in Svelte, React, Vue, Angular, HTML and Blazor (P12-T5a, 2026-10-30; it was a labelled container until then) and Alpine; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .tree-menu
- Interactive: yes

## Key Behaviors

- Renders a `<div>` with `role="tree"` for tree view semantics (Alpine renders a `<ul>`; tasks.md P10-T12)
- Queries `[role="treeitem"]` descendants to build the navigable item list
- Arrow key navigation wraps around from last to first item and vice versa
- Consumer provides `<li role="treeitem">` children with `tabindex="-1"` for focusability
- Accepts `...restProps` for forwarding additional attributes to the root element

## ARIA

- `role="tree"` -- identifies the container as a tree view widget
- `aria-label={label}` -- provides an accessible name for the tree
- Consumer items should use `role="treeitem"` on each navigable child

## Keyboard

- Arrow Down: Move focus to the next tree item (wraps to first)
- Arrow Up: Move focus to the previous tree item (wraps to last)
- Home: Move focus to the first tree item
- End: Move focus to the last tree item

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: slot (required) -- tree item elements, expected to be `<li role="treeitem">` elements

## Acceptance Criteria

- [ ] Renders <div> element with class="tree-menu"
- [ ] Has aria-label attribute
- [ ] Has role="tree"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tree-menu in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tree-menu.html
- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
