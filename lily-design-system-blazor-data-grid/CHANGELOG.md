# Changelog — DataGrid (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.10.0 — 2026-10-17

- Added search that matches every typed word in any order, ignoring case and diacritics (`SearchText`); Escape in the field clears it; `Labels.FilterAnnouncement` announces the count. The field carries the headless `search-input` class (written by hand, not composed).
- Added field search (`FilterField`, `FilterFieldChanged`, `Labels.SearchField`, `Labels.SearchAllFields`) and `RowFilter`.
- Added `EmptyValue` (and a column's own) with `data-empty` on every missing cell, and `Nulls` (`First` or `Last`) for where missing values sort.
- Added copy to the clipboard: `Labels.Copy` button, `Labels.CopyAnnouncement`, `Labels.CopyFailed`, `OnCopy`, `CopyHandler` (return `false` to take over).
- Added undo and redo of cell edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `OnCellEdit`, with `Labels.UndoAnnouncement` / `RedoAnnouncement`.
- Added PageUp / PageDown by ten rows (the rows in view when virtualized), type-ahead on the first cell, and right-to-left arrow keys through the `Direction` parameter (Blazor cannot read the DOM's `dir` without JS interop, so the consumer says). `GridMotion`, `Typeahead`, `EditHistory` and `SearchText` are public pure classes with the Svelte shared tests' vectors; the kanban board, Gantt chart and calendar reference this package and can use them.
- Added `Labels.Pagination`: the pager becomes a labelled `<nav>` landmark.
- Not yet ported from the Svelte package: multi-column sort (`thenBy`), locale-aware text sort, the missing-label check, and composition from the headless layer.

## 0.9.0 — 2026-10-16

Initial release, at the version of the canonical
[`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/) it ports (the contract is that
package's `spec/index.md`): sort, filter, selection, resize, visibility, reorder and pinning, pagination, APG Grid
keyboard navigation, inline cell editing, row virtualization, export to CSV / TSV / Excel (`.xlsx` with optional live
formulas), and all twelve cell types. Blazor idioms: bindable parameters with `…Changed` callbacks, enums for the closed unions, .NET format strings in place of `Intl`.
