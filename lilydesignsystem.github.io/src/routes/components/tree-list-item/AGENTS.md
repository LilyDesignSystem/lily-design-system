# TreeListItem

## Metadata

- Component: tree-list-item
- PascalCase: TreeListItem
- Description: one item in a tree navigation list
- HTML tag: <li>
- CSS class: .tree-list-item
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Parent: tree-list

## Key Behaviors

- Renders an `<li>` inside a `TreeList`
- Items with children render a nested `TreeList` and reflect their open/closed state via `aria-expanded`
- Leaf items (no children) omit `aria-expanded`
- The consumer drives expand/collapse — typically via a child disclosure button or a `<details>` element
- Spreads `restProps` onto the `<li>`

## ARIA

- `role="treeitem"` -- identifies the element as an item in a tree widget
- `tabindex` -- manages focus: `0` for the active item, `-1` for others (roving tabindex)
- `aria-expanded` -- indicates whether an expandable item is open (`true`) or closed (`false`); omit for leaf nodes
- `aria-selected` -- indicates whether the item is selected (optional)

## Keyboard

- ArrowDown: Moves focus to the next visible tree item (managed by parent TreeList)
- ArrowUp: Moves focus to the previous visible tree item (managed by parent TreeList)
- ArrowRight: Expands a collapsed item, or moves to first child (when applicable)
- ArrowLeft: Collapses an expanded item, or moves to parent (when applicable)
- Home: Moves focus to the first tree item (managed by parent TreeList)
- End: Moves focus to the last visible tree item (managed by parent TreeList)

## Props

| Prop           | Type            | Default    | Description                                                                                          |
| -------------- | --------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `children`     | `slot`       | (required) | Content for the tree item                                                                            |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<li>` element (including `role`, `tabindex`, `aria-expanded`) |

## Acceptance Criteria

- [ ] Renders <li> element with class="tree-list-item"
- [ ] Has role="treeitem"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tree-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tree-list-item.html
- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- WAI-ARIA treeitem role: https://www.w3.org/TR/wai-aria-1.2/#treeitem
