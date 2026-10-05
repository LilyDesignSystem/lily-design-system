# FileTree

A hierarchical tree of folders and files with expandable folders, following the WAI-ARIA APG tree pattern.
Root `<ul class="file-tree" role="tree" aria-label>`; the consumer supplies `<li role="treeitem" aria-expanded? aria-selected?>` items, with a nested `<ul role="group">` in each folder. Hiding a closed folder's group is consumer CSS.
See `components/file-tree/index.md`.

## Parameters

- `Label`: string (required)
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Keyboard

Roving tabindex (exactly one visible item has `tabindex="0"`). ArrowDown/Up next/previous visible item (clamped); ArrowRight opens a closed folder or moves to its first child; ArrowLeft closes an open folder or moves to the parent; Home/End first/last visible; `*` expands sibling folders; printable characters typeahead on the item's own text; Enter/Space click the item.

## Deviation from Svelte

C# has no synchronous DOM access and the items are consumer markup, so the keyboard lives in a small collocated ES module, `FileTree.razor.js` (browser DOM APIs only, no styling), a faithful port of the Svelte logic, loaded via JS interop from `./_content/LilyDesignSystem.Blazor.Headless/Components/FileTree.razor.js` after first render (so not during prerender). Under static SSR with no interactivity the tree renders correctly but has no arrow-key behaviour. The JS is tested in `tests/js/file-tree.test.mjs` (`node --test`, needs `jsdom`); the Razor contract and interop wiring are tested by bUnit.
