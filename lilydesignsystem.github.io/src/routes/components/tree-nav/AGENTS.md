# TreeNav

## Metadata

- Component: tree-nav
- PascalCase: TreeNav
- Description: a hierarchical navigation with expandable branches
- HTML tag: <nav>
- CSS class: .tree-nav
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Children: tree-list, tree-list-item

## Key Behaviors

- Renders as a `<nav>` element to create a navigation landmark for the tree structure
- The `label` prop sets `aria-label` to identify the navigation region
- Consumer provides a TreeList with TreeListItem children inside the nav
- The TreeList manages tree keyboard navigation (arrow keys, Home, End)
- Spreads `...restProps` onto the `<nav>` element for consumer customization
- No internal state -- purely a structural wrapper providing the navigation landmark

## ARIA

- `<nav aria-label="...">` -- creates a navigation landmark with a descriptive label for the tree navigation region
- Tree semantics (`role="tree"`, `role="treeitem"`) are provided by the child TreeList and TreeListItem components

## Keyboard

- ArrowDown: Moves focus to the next visible tree item (managed by TreeList)
- ArrowUp: Moves focus to the previous visible tree item (managed by TreeList)
- ArrowRight: Expands a collapsed item, or moves to first child
- ArrowLeft: Collapses an expanded item, or moves to parent
- Home: Moves focus to the first tree item
- End: Moves focus to the last visible tree item

## Props

- `label`: string (required) -- accessible name for the navigation landmark via `aria-label`
- `children`: slot (required) -- TreeList with tree navigation items
- `...restProps`: any -- additional HTML attributes spread onto the `<nav>` element

## Acceptance Criteria

- [ ] Renders <nav> element with class="tree-nav"
- [ ] Has aria-label attribute
- [ ] Has role="tree"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tree-nav in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tree-nav.html
- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- WAI-ARIA Navigation Role: https://www.w3.org/TR/wai-aria-1.2/#navigation
