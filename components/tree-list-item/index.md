# Tree List Item

A tree list item is a single item within a TreeList hierarchy, rendered as an `<li>` element with `role="treeitem"`. It supports keyboard focus management via `tabindex` and can represent expandable or leaf nodes in the tree structure.

## Help

Use TreeListItem for individual entries within a TreeList. Common scenarios include file browser entries, organizational chart nodes, nested navigation items, and category trees. Items can be expandable (branches) or leaf nodes.

## Syntax

```html
<TreeListItem label="...">Label</TreeListItem>
```

## Usage

```html
<TreeNav label="Clinical navigation">
  <TreeList label="Departments">
    <TreeListItem tabindex="0" aria-expanded="true">
      Cardiology
      <ul role="group">
        <TreeListItem tabindex="-1">
          <TreeLink href="/cardiology/outpatients">Outpatients</TreeLink>
        </TreeListItem>
        <TreeListItem tabindex="-1">
          <TreeLink href="/cardiology/inpatients">Inpatients</TreeLink>
        </TreeListItem>
      </ul>
    </TreeListItem>
    <TreeListItem tabindex="-1" aria-expanded="false">
      Oncology
    </TreeListItem>
    <TreeListItem tabindex="-1">
      <TreeLink href="/radiology">Radiology</TreeLink>
    </TreeListItem>
  </TreeList>
</TreeNav>
```

## Props

| Prop           | Type            | Default    | Description                                                                                          |
| -------------- | --------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `children`     | `slot`       | (required) | Content for the tree item                                                                            |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<li>` element (including `role`, `tabindex`, `aria-expanded`) |

## Examples

Navigation tree:

```html
<TreeList label="Site navigation">
  <TreeListItem tabindex="0" aria-expanded="false">
    Products
  </TreeListItem>
  <TreeListItem tabindex="-1" aria-expanded="false">
    Services
  </TreeListItem>
  <TreeListItem tabindex="-1">About</TreeListItem>
</TreeList>
```

## Keyboard Interactions

- ArrowDown: Moves focus to the next visible tree item (managed by parent TreeList)
- ArrowUp: Moves focus to the previous visible tree item (managed by parent TreeList)
- ArrowRight: Expands a collapsed item, or moves to first child (when applicable)
- ArrowLeft: Collapses an expanded item, or moves to parent (when applicable)
- Home: Moves focus to the first tree item (managed by parent TreeList)
- End: Moves focus to the last visible tree item (managed by parent TreeList)

## ARIA

- `role="treeitem"` -- identifies the element as an item in a tree widget
- `tabindex` -- manages focus: `0` for the active item, `-1` for others (roving tabindex)
- `aria-expanded` -- indicates whether an expandable item is open (`true`) or closed (`false`); omit for leaf nodes
- `aria-selected` -- indicates whether the item is selected (optional)
## When to Use

- Use inside TreeList to represent one item that may contain nested TreeList children.
- Use for both expandable branch nodes (with `aria-expanded`) and leaf nodes.
- Use with TreeLink inside the item for navigable leaf nodes.

## When Not to Use

- Do not use outside TreeList -- it relies on the parent for keyboard navigation and tree semantics.
- Do not use for flat list items -- use ContentsListItem or AccordionListItem instead.
- Do not use for standalone expandable content -- use Collapsible or Details instead.

## Headless

This headless component provides an `<li>` element with `role="treeitem"` support. The consumer manages `tabindex`, `aria-expanded`, and `aria-selected` attributes via restProps, and provides all content and visual styling including indentation, icons, and expansion indicators.


## Styles

The consumer provides all CSS styling. The component renders with a `.tree-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `tree-list-item`
- Verify role="treeitem"` -- identifies the element as an item in a tree widget
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Distinguish branch nodes from leaf nodes visually (e.g., folder vs. file icons, chevron indicators). Highlight the currently focused or selected item.
- **Developers**: Use `tabindex="0"` for the active item and `tabindex="-1"` for all others (roving tabindex pattern). Omit `aria-expanded` for leaf nodes.

## Composition

TreeListItem is a child of TreeList, following the Nav/List/ListItem pattern. Expandable items can contain a nested `<ul role="group">` with additional TreeListItem children to create subtrees.

## References

- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- WAI-ARIA treeitem role: https://www.w3.org/TR/wai-aria-1.2/#treeitem
