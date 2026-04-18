# TreeList

TreeList is a headless hierarchical list component that uses the ARIA `tree` role with full keyboard navigation. It provides an accessible container for displaying nested or flat tree structures such as file browsers, organizational charts, or navigation menus.

This component manages keyboard navigation between tree items using ArrowDown, ArrowUp, Home, and End keys with wrapping behavior. Consumers provide the tree items as children with `role="treeitem"` and `tabindex` attributes, and bring their own styling for indentation, expansion indicators, and visual hierarchy.

## Implementation Notes

- Renders a `<ul>` element with `role="tree"` for semantic tree structure
- Uses `aria-label` for an accessible name describing the tree
- Maintains a `treeRef` via `$state` and `bind:this` to query tree items for keyboard navigation
- Handles keyboard navigation via an `onkeydown` handler that queries all `[role='treeitem']` elements
- ArrowDown/ArrowUp navigate between items with wrapping; Home/End jump to first/last item
- Spreads `restProps` onto the `<ul>` for consumer customization
- Svelte 5 patterns: `$state` for the element reference

## Props

- `label`: string (required) -- accessible name for the tree via `aria-label`
- `children`: Snippet (required) -- tree item elements with `role="treeitem"` to render inside the list
- `...restProps`: unknown -- additional attributes spread onto the `<ul>` element

## Usage

```svelte
<TreeList label="File browser">
  <li role="treeitem" tabindex="0">Documents</li>
  <li role="treeitem" tabindex="-1">Photos</li>
</TreeList>
```

## Keyboard Interactions

- ArrowDown: Moves focus to the next tree item; wraps to the first item after the last
- ArrowUp: Moves focus to the previous tree item; wraps to the last item before the first
- Home: Moves focus to the first tree item
- End: Moves focus to the last tree item

## ARIA

- `role="tree"` -- identifies the container as a tree widget for hierarchical data
- `aria-label={label}` -- provides an accessible name describing the purpose of the tree

## References

- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/TreeList/
- WAI-ARIA tree role: https://www.w3.org/TR/wai-aria-1.2/#tree
