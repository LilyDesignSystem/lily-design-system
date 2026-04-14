# Tree Menu

A tree menu is a component that displays hierarchical or nested navigation options, often represented with expandable and collapsible nodes resembling the structure of a tree. Each node can contain sub-options or categories, allowing users to drill down into deeper levels of content or functionality. This type of menu is particularly useful for organizing complex or large datasets, file directories, or multi-level categories.

This headless component renders a `<ul>` with `role="tree"` and provides keyboard navigation for tree items. It manages focus movement between `[role="treeitem"]` elements using arrow keys, Home, and End, with wrapping at boundaries.

## Implementation Notes

- Renders a `<ul>` element with `role="tree"` for tree view semantics
- Uses reactive state to track the tree element reference for keyboard navigation
- Queries `[role="treeitem"]` descendants to build the navigable item list
- Arrow key navigation wraps around from last to first item and vice versa
- Consumer provides `<li role="treeitem">` children with `tabindex="-1"` for focusability
- Accepts `...restProps` for forwarding additional attributes to the list element

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: slot (required) -- tree item elements, expected to be `<li role="treeitem">` elements

## Usage

```html
<TreeMenu label="File actions">
  <li role="treeitem" tabindex="0" aria-expanded="true">
    File
    <ul role="group">
      <li role="treeitem" tabindex="-1">New</li>
      <li role="treeitem" tabindex="-1">Open</li>
      <li role="treeitem" tabindex="-1">Save</li>
    </ul>
  </li>
  <li role="treeitem" tabindex="-1" aria-expanded="false">
    Edit
  </li>
  <li role="treeitem" tabindex="-1">Help</li>
</TreeMenu>
```

```html
<TreeMenu label="Category browser">
  <li role="treeitem" tabindex="0" aria-expanded="true">
    Cardiology
    <ul role="group">
      <li role="treeitem" tabindex="-1">Heart Failure</li>
      <li role="treeitem" tabindex="-1">Arrhythmia</li>
    </ul>
  </li>
  <li role="treeitem" tabindex="-1">Oncology</li>
</TreeMenu>
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

## When to Use

- Use for a hierarchical tree menu with expandable branches for browsing nested action options.
- Use when the data has a natural tree structure with parent-child relationships.
- Use for file directories, category browsers, or multi-level action menus.
- Use when the tree is not a site navigation landmark (no `<nav>` element needed).

## When Not to Use

- Do not use for flat action menus -- use Menu instead.
- Do not use for navigation landmarks -- use TreeNav instead (which wraps a tree in a `<nav>` element).
- Do not use for flat lists without hierarchy -- use a simple list or Menu instead.

## Headless

This headless component provides a `<ul>` with `role="tree"`, `aria-label`, and built-in keyboard navigation (ArrowUp, ArrowDown, Home, End with wrapping). The consumer provides `<li role="treeitem">` children and all visual styling including indentation, expansion indicators, and icons.


## Styles

The consumer provides all CSS styling. The component renders with a `.tree-menu` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `tree-menu`
- Verify role="tree"` -- identifies the container as a tree view widget
- Verify aria-label={label}` -- provides an accessible name for the tree
- Verify Consumer items should use `role="treeitem"` on each navigable child
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use indentation and visual connectors (lines or icons) to clearly show the hierarchy depth. Provide expand/collapse indicators for branch nodes.
- **Developers**: Ensure all tree items have `role="treeitem"` and `tabindex="-1"` for keyboard focusability. Use nested `<ul role="group">` for subtrees.

## References

- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/treeview/
