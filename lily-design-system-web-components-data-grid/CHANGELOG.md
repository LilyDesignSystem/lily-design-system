# Changelog — DataGrid (Web Components)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.10.0 — 2026-10-17

- Added `labels.pagination`: the pager becomes a labelled `<nav>` landmark, the headless `PaginationNav` (without it the pager is the plain `<div>` it was). The search field is the headless `SearchInput`.
- Now composed from the headless layer: the search field is the headless `SearchInput` (the `search-input` / `mark` base classes join the existing `*-search` / `*-match` hooks, so the 57 themes style them too). Keyboard movement (arrows, Home/End, page keys, right-to-left) comes from the shared `grid-navigation` module.
- Added `emptyValue` (and a column's own) with `data-empty`, `nulls` (first or last), locale-aware sorting of plain text (`Intl.Collator`, numeric), field-specific search (`filterField`, `labels.searchField`), `movableColumns`, right-to-left arrow keys (`isRtl`, `logicalKey`), and a missing-label check (`requiredLabels`, `missingLabels`, a development warning, `warnMissingLabels`). Documented `rowAttrs`.
- Added undo and redo of cell edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `onCellEdit`.
- Added type-ahead to the grid keyboard.
- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `onCopy`; `toClipboardText`, `copyToClipboard`).
- Added `rowFilter` and multi-column sort (`thenBy`, Shift+click).
- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. 
- Ported from the Svelte 0.10.0; the pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.9.0 — 2026-10-16

Initial release, at the version of the canonical
[`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/) it ports (the contract is that
package's `spec/index.md`): sort, filter, selection, resize, visibility, reorder and pinning, pagination, APG Grid
keyboard navigation, inline cell editing, row virtualization, export to CSV / TSV / Excel (`.xlsx` with optional live
formulas), and all twelve cell types. Independent copy of the HTML data grid with the `lily-` tag prefix.
