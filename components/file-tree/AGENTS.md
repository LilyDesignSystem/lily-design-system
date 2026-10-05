# FileTree

## Metadata

- Component: file-tree
- PascalCase: FileTree
- Description: a hierarchical tree of folders and files with expandable folders
- Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)
- HTML tag: <ul>
- CSS class: .file-tree
- Interactive: yes

## Key Behaviors

- `<ul role="tree">` root; consumer-supplied treeitems
- Roving tabindex over visible items
- APG tree keyboard: arrows, Home / End, `*`, typeahead, Enter / Space
- Folder state is `aria-expanded` only

## ARIA

- `role="tree"` and `aria-label={label}` on the root
- Consumer supplies `role="treeitem"`, `role="group"`, `aria-expanded` (folders) and `aria-selected`

## Keyboard

- Tab: moves focus into the tree to the single tab-stop item, and out of it
- ArrowDown / ArrowUp: next / previous visible item (no wrap)
- ArrowRight: on a closed folder opens it; on an open folder moves to its first child
- ArrowLeft: on an open folder closes it; otherwise moves to the parent folder
- Home / End: first / last visible item
- `*`: expands all closed sibling folders at the focused level
- Printable characters: typeahead to the next visible item whose text starts with the typed characters
- Enter / Space: activates the focused item

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (required) -- accessible name via `aria-label`
- `children`: slot -- the tree items
- `...restProps`: unknown -- additional attributes spread onto the `<ul>`

## Acceptance Criteria

- [ ] Renders <ul role="tree" class="file-tree"> with aria-label
- [ ] Exactly one visible item has tabindex=0
- [ ] Keyboard: ArrowDown/Up/Right/Left, Home, End, *, typeahead, Enter/Space
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .file-tree in css-style-sheet-template.css
