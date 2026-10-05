# FileTree

FileTree is a headless tree widget for folders and files following the WAI-ARIA tree pattern. The consumer supplies `<li role="treeitem">` items (folders carry `aria-expanded` and a nested `<ul role="group">`); the root owns the keyboard and a roving tabindex.

**Status:** beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)

## Implementation Notes

- Renders `<ul class="file-tree" role="tree" aria-label={label}>`
- Roving tabindex: exactly one visible treeitem has `tabindex="0"`, the rest `-1`; the tab stop follows focus and is re-seated if its item becomes hidden
- Visible items are those with no closed (`aria-expanded="false"`) ancestor treeitem
- Opening and closing is done by toggling `aria-expanded`; hiding a closed folder's group is consumer CSS
- Arrow keys clamp at the ends (no wrap), per the APG
- Typeahead matches the item's own text (excluding nested groups), with a 500 ms buffer
- Enter / Space call `click()` on the focused item
- No custom events are dispatched
- Spreads `restProps` onto the `<ul>`

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (required) -- accessible name via `aria-label`
- `children`: slot -- the tree items
- `...restProps`: unknown -- additional attributes spread onto the `<ul>`

## Usage

```html
<FileTree label="Project files">
  <li role="treeitem" aria-expanded="true" aria-selected="false">src
    <ul role="group">
      <li role="treeitem" aria-selected="false">index.ts</li>
    </ul>
  </li>
  <li role="treeitem" aria-selected="false">readme.md</li>
</FileTree>
```

Consumer CSS hides a closed folder's group:

```css
[role="treeitem"][aria-expanded="false"] > [role="group"] { display: none; }
```

## Keyboard Interactions

- Tab: moves focus into the tree to the single tab-stop item, and out of it
- ArrowDown / ArrowUp: next / previous visible item (no wrap)
- ArrowRight: on a closed folder opens it; on an open folder moves to its first child
- ArrowLeft: on an open folder closes it; otherwise moves to the parent folder
- Home / End: first / last visible item
- `*`: expands all closed sibling folders at the focused level
- Printable characters: typeahead to the next visible item whose text starts with the typed characters
- Enter / Space: activates the focused item

## ARIA

- `role="tree"` and `aria-label={label}` on the root
- Consumer supplies `role="treeitem"`, `role="group"`, `aria-expanded` (folders) and `aria-selected`

## When to Use

- Use for navigating folders and files, such as a repository, document store or asset library.
- Use for a hierarchy where users need arrow-key navigation and expand / collapse.
- Use when the consumer controls item content, icons and selection.

## When Not to Use

- Do not use for site navigation links -- use `tree-nav`.
- Do not use for a simple nested list -- use `tree-list`.
- Do not use for a flat list of choices -- use `listbox`.

## Headless

This headless component renders the `<ul role="tree">` and the keyboard behaviour only. It draws no icons or indentation and does not hide closed folders; the consumer supplies items, icons and CSS.

## Styles

The consumer provides all CSS styling via the `.file-tree` class, and hides closed groups with `[aria-expanded="false"] > [role="group"]`.

## Testing

- Verify `<ul role="tree">` with `aria-label` and class `file-tree`
- Verify exactly one tab stop that follows focus, and re-seating when hidden
- Verify ArrowDown / ArrowUp, no wrap, skipping closed folders
- Verify Home / End
- Verify ArrowRight open / first child, ArrowLeft close / parent
- Verify `*` expands siblings only at the focused level
- Verify typeahead (single, multi-character, hidden items ignored, own text only)
- Verify Enter and Space activate
- Verify pass-through attributes

## Advice

- **Designers**: Indicate expanded state and the focused item clearly; do not rely on colour alone.
- **Developers**: Keep `aria-expanded` in sync if you also toggle folders by click (a click handler can flip the attribute). Mark files as `aria-selected` as you need.

## Related components

- `tree-nav` — a navigation landmark containing a tree of links
- `tree-list` — a simpler hierarchical list
- `listbox` — a flat selectable list

## References

- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

---

Lily™ and Lily Design System™ are trademarks.
