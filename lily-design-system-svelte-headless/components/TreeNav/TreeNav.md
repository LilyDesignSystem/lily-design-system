# TreeNav

A tree menu is a component that displays hierarchical or nested navigation options, often represented with expandable and collapsible nodes resembling the structure of a tree. Each node can contain sub-options or categories, allowing users to drill down into deeper levels of content or functionality. This type of menu is particularly useful for organizing complex or large datasets, file directories, or multi-level categories.

This headless component renders a `<ul>` with `role="tree"` and provides keyboard navigation for tree items. It manages focus movement between `[role="treeitem"]` elements using arrow keys, Home, and End, with wrapping at boundaries.

## Implementation Notes

- Renders a `<ul>` element with `role="tree"` for tree view semantics
- Uses `$state()` to track the tree element reference for keyboard navigation
- Queries `[role="treeitem"]` descendants to build the navigable item list
- Arrow key navigation wraps around from last to first item and vice versa
- Consumer provides `<li role="treeitem">` children with `tabindex="-1"` for focusability
- Accepts `...restProps` for forwarding additional attributes to the list element

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: Snippet (required) -- tree item elements, expected to be `<li role="treeitem">` elements

## Usage

```svelte
<TreeNav label="Navigation">
    <li role="treeitem" tabindex="-1">Home</li>
    <li role="treeitem" tabindex="-1">About</li>
    <li role="treeitem" tabindex="-1">Contact</li>
</TreeNav>
```

## Keyboard Interactions

- Arrow Down: Move focus to the next tree item (wraps to first)
- Arrow Up: Move focus to the previous tree item (wraps to last)
- Home: Move focus to the first tree item
- End: Move focus to the last tree item

## ARIA

- `role="tree"` -- identifies the container as a tree view widget
- `aria-label={label}` -- provides an accessible name for the tree
- Consumer items should use `role="treeitem"` on each navigable child

## References

- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/TreeList/
