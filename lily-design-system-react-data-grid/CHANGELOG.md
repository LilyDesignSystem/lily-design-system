# Changelog — DataGrid (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.9.0 — 2026-10-16

- Added the five remaining cell types, ported from the Svelte 0.9.0: `time-zone`, `person` (`avatar`, `personEditor` render props), `file` (`onFilesSelected`, `onFileRemove`; nothing is uploaded), `rollup` (read-only, `aggregate` / `reduce` / `relation`) and `formula` (the consumer's `evaluate`; no engine, no string evaluation). Rollup and formula results are computed once per row each time `rows` or `columns` change. New exports: `aggregateValues`, `isZonedTime`, `isValidTimeZone`, `zonedMinutes`, `peopleOf`, `personName`, `filesOf`.

## 0.8.0 — 2026-10-16

- Added `column.type`, ported from the Svelte 0.8.0: `"text" | "number" | "link" | "date" | "time" | "select" | "radio"`, a bundle of defaults for `format`, `compare`, `filterText`, `exportValue`, `align` and `editor` plus each type's markup; your own props win. `data-cell-type` on the header and cells. New column props `locale`, `options`, `sortBy`, `exportAs`, `numberFormat`, `dateFormat`, `timeFormat`, `filterText`; a grid `locale` prop (never defaulted).
- link renders an `<a>` for `http:`, `https:`, `mailto:`, `tel:` and relative addresses only (anything else is text); date and time render `<time datetime>`; select edits with a native `<select>`; radio renders a `fieldset` of radios and commits on change. Typed values are checked on commit (`labels.invalidValue`).
- Exported `cell-types.ts` helpers: `resolveColumn`, `safeHref`, `linkParts`, `linkLabel`, `isCivilDate`, `isCivilTime`, `civilDateToDate`, `isInvalidForType`.

## 0.7.0 — 2026-10-16

- Added export to CSV, TSV and Excel (.xlsx), ported from the Svelte 0.7.0: `labels.exportCsv` / `exportTsv` / `exportExcel` gate one button each inside a group named by `labels.export`; the file holds the visible, `exportable` columns for the filtered, sorted rows across every page (`exportScope="selected"` for the selected rows only). `exportFilename`, `column.exportValue`, `column.exportable`, `onExport(file)` (return `false` to keep the grid from saving it), `labels.exportAnnouncement`.
- Fixed the cell editor committing when Enter confirmed an input-method (IME) candidate: keys during composition (`isComposing`, or `keyCode` 229) are ignored.
- The writers are exported as pure functions (`toCsv`, `toTsv`, `toDelimited`, `toXlsx`, `exportBlob`, `exportFilename`, `downloadBlob`, `cellText`, `columnName`, `zipStore`, `crc32`), the same dependency-free module as the Svelte package.

## 0.6.0 — 2026-10-16

- Added inline cell editing, ported from the Svelte 0.6.0: `column.editable` (with `editor: "text" | "number"`, `parse`, `validate`), F2 or Enter on a focused cell, a double click, or the `labels.editCell` button; Enter commits, Escape cancels, leaving the field commits; `onCellEdit({ rowId, row, columnId, value, previous })`, the grid never mutates `rows`; `validate` keeps the cell in edit mode with `aria-invalid`. Labels: `cellEditor`, `editAnnouncement`, `editCancelAnnouncement`, `editError`.
- Added row virtualization: `virtualize: { rowHeight, height, overscan? }` renders only the rows in view (plus the roving tab stop's row) between `.data-grid-spacer` rows; `aria-rowcount` and every row's `aria-rowindex` are always set. Keyboard focus scrolls the target row into view.

## 0.5.0 — 2026-10-14

- Added column reordering (`column.movable`, `columnOrder`, `onColumnOrderChange`, `labels.columnMoveAnnouncement`; Alt+ArrowLeft/Right or header drag) and `column.pinned` (`data-pinned`), ported from the Svelte 0.5.0.

## 0.4.0 — 2026-10-13

Initial release, at the version of the canonical
[`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/)
it ports (the contract is that package's `spec/index.md`). Translated to
React 19 idioms: hooks instead of runes; a controlled prop (`selected`,
`filter`, `sort`, `page`) or its `default…` twin instead of two-way binding,
with `on…Change` callbacks (including a new `onPageChange`); render props
(`cell`, `headerCell`, `footer`, an `empty` node) instead of snippets;
`className` instead of `class`. Composes `@lilydesignsystem/react-headless`'s
`DataTable` family unmodified.
