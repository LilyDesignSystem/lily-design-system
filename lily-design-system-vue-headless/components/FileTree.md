# FileTree

a tree of folders and files with full APG tree keyboard support

## Implementation Notes

- Root `<ul role="tree">`; consumer supplies `<li role="treeitem">` items (nested `<ul role="group">` for folders)
- Roving tabindex managed by the root (a `MutationObserver` keeps exactly one visible tab stop)
- Open/close is by toggling `aria-expanded`; consumer CSS hides closed groups

## Props

- `label`: string (required)
- default slot: tree items

## Usage

```vue
<FileTree label="Files"><li role="treeitem">readme.md</li></FileTree>
```

## Keyboard Interactions

- ArrowDown / ArrowUp: next / previous visible item
- ArrowRight: open closed folder, or move to first child
- ArrowLeft: close open folder, or move to parent
- Home / End: first / last visible item
- `*`: expand all closed siblings at this level
- Printable characters: typeahead
- Enter / Space: activate the item

Canonical documentation: ../../components (see the component's `components/{slug}/index.md`).
