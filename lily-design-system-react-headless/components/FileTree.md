# FileTree

A WAI-ARIA tree for file/folder hierarchies. Root `<ul role="tree">`; the consumer supplies `<li role="treeitem">` descendants (folders carry `aria-expanded` and a nested `<ul role="group">`). The root owns the keyboard model with a roving tabindex (exactly one item has `tabindex="0"`).

## Props

- `className`: string (optional)
- `label`: string (required) -- `aria-label`
- `children`: ReactNode -- tree items
- `...restProps` -- spread onto the root

## Implementation Notes

Opening/closing is by toggling `aria-expanded` on the item; consumer CSS hides a closed folder's group. No custom event is dispatched.

Deviation (React): like the Svelte canonical, expanded state and the roving tabindex are written directly onto the rendered DOM (`setAttribute`) and kept consistent with a `MutationObserver`. React does not reconcile attributes it does not render, so this is stable; but if a consumer re-renders `aria-expanded` with a changed value, its value wins on that render. The behaviour is otherwise identical.

## Keyboard Interactions

| Key | Action |
| --- | --- |
| ArrowDown / ArrowUp | next / previous visible item (no wrap) |
| ArrowRight | closed folder opens; open folder moves to first child |
| ArrowLeft | open folder closes; otherwise moves to parent |
| Home / End | first / last visible item |
| `*` | expand all closed sibling folders at the focused level |
| printable characters | typeahead on the item's own text |
| Enter / Space | activate (click) the item |

## ARIA

`role="tree"`, `role="treeitem"`, `role="group"`, `aria-expanded`, `aria-selected` (consumer).

## Related components

`TreeList`, `TreeNav`.
