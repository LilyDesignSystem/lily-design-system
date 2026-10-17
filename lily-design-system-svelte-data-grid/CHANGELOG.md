# Changelog — DataGrid (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.10.0 — 2026-10-17

- Added `emptyValue` (and a column's own) with `data-empty`, `nulls` (first or last), locale-aware sorting of plain text (`Intl.Collator`, numeric), field-specific search (`filterField`, `labels.searchField`), `movableColumns`, right-to-left arrow keys (`isRtl`, `logicalKey`), and a missing-label check (`requiredLabels`, `missingLabels`, a development warning, `warnMissingLabels`). Documented `rowAttrs`.
- Added undo and redo of cell edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `onCellEdit`.
- Added type-ahead to the grid keyboard.
- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `onCopy`; `toClipboardText`, `copyToClipboard`).
- Added `rowFilter` and multi-column sort (`thenBy`, Shift+click).
- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. 

## 0.9.0 — 2026-10-16

- Added the five remaining cell types: `time-zone` (`{ time, timeZone }`, shown in the zone it was stated in, ordered by the UTC minute at the consumer's `referenceDate`, edited with a time field and a `timeZones` select), `person` (names as text, `maxPeople` + `labels.morePeople`, decorative `avatar` snippet, a `personEditor` snippet given `{ value, commit, cancel }`), `file` (names, safe links, `formatSize`, a native file input that reports `File` objects through `onFilesSelected` and a remove button through `onFileRemove`; the grid uploads nothing), `rollup` (`aggregate` or `reduce` over a `relation`, read-only with `aria-readonly`, `labels.rollupDescription` on the header) and `formula` (the consumer's `evaluate(expression, { row, rows, columnId })`; Lily ships no engine and evaluates no string; errors are text with `data-error`; the editor shows the expression).
- Results of a rollup and a formula are computed once per row each time `rows` or `columns` change. New exports: `aggregateValues`, `isZonedTime`, `isValidTimeZone`, `zonedMinutes`, `peopleOf`, `personName`, `filesOf`.
- Also built what the first 0.9.0 cut left out: `time-zone` `exportUtc` (an extra UTC time-of-day export column at `referenceDate`, headed by `labels.exportUtcHeader`), person `exportAs: "email"`, drag-and-drop of files onto an editable file cell (reported through `onFilesSelected`, like the input), and `exportFormulas` (an `.xlsx` formula cell keeps `<f>expression</f>` with the result cached; CSV and TSV carry the result). `export-data.ts` gains the `ExportFormula` cell value and `isExportFormula`; the cell-types module gains `zonedUtcTime`.

## 0.8.0 — 2026-10-16

- Added `column.type`: `"text" | "number" | "link" | "date" | "time" | "select" | "radio"`, a bundle of defaults for `format`, `compare`, `filterText`, `exportValue`, `align` and `editor` plus each type's markup; your own props win. `data-cell-type` on the header and cells. New column props `locale`, `options`, `sortBy`, `exportAs`, `numberFormat`, `dateFormat`, `timeFormat`, `filterText`; a grid `locale` prop (never defaulted: with none, values show as stored).
- link renders an `<a>` for `http:`, `https:`, `mailto:`, `tel:` and relative addresses only (anything else, `javascript:` included, is text); `external` adds `target="_blank"` `rel="noopener noreferrer"` and `labels.opensInNewTab`. date and time render `<time datetime>`; select edits with a native `<select>` (grouped options); radio renders a `fieldset` of radios named per row and column and commits on change. Typed values are checked on commit (`labels.invalidValue`).
- Exported `cell-types.ts` helpers: `resolveColumn`, `safeHref`, `linkParts`, `linkLabel`, `isCivilDate`, `isCivilTime`, `civilDateToDate`, `isInvalidForType`. A civil date now writes without a time of day in CSV/TSV.

## 0.7.0 — 2026-10-16

- Added export to CSV, TSV and Excel (.xlsx). `labels.exportCsv` / `exportTsv` / `exportExcel` gate one button each inside a group named by `labels.export`; the file holds the visible, `exportable` columns for the filtered, sorted rows across every page (`exportScope="selected"` for the selected rows only). `exportFilename`, `column.exportValue`, `column.exportable`, `onExport(file)` (return `false` to keep the grid from saving it), `labels.exportAnnouncement`.
- Fixed the cell editor committing when Enter confirmed an input-method (IME) candidate: keys during composition (`isComposing`, or `keyCode` 229) are now ignored, so Enter does not commit and Escape does not cancel until composition ends.
- The writers are exported as pure functions for your own button or a server: `toCsv`, `toTsv`, `toDelimited`, `toXlsx`, `exportBlob`, `exportFilename`, `downloadBlob`, `cellText`, `columnName`, `zipStore`, `crc32`. The .xlsx writer has no dependencies (a stored ZIP of the workbook's XML parts) and is reproducible byte for byte.

## 0.6.0 — 2026-10-16

- Added inline cell editing: `column.editable` (with `editor: "text" | "number"`, `parse`, `validate`), F2 or Enter on a focused cell, a double click, or the `labels.editCell` button; Enter commits, Escape cancels, leaving the field commits; `onCellEdit({ rowId, row, columnId, value, previous })`, the grid never mutates `rows`; `validate` keeps the cell in edit mode with `aria-invalid`. Labels: `cellEditor`, `editAnnouncement`, `editCancelAnnouncement`, `editError`.
- Added row virtualization: `virtualize: { rowHeight, height, overscan? }` renders only the rows in view (plus the roving tab stop's row) between `.data-grid-spacer` rows; `aria-rowcount` and every row's `aria-rowindex` are always set. Keyboard focus scrolls the target row into view.

## 0.5.0 — 2026-10-14

- Added column reordering (`column.movable`: Alt+ArrowLeft/Right on a focused header, or dragging a header onto another; bindable `columnOrder`,
  `onColumnOrderChange`, `labels.columnMoveAnnouncement`) and `column.pinned` (`data-pinned="start" | "end"` for sticky CSS). Tests §8.40–§8.46.

## 0.4.0 — 2026-10-13

Rich cells. A grid whose cells can hold links, buttons, inputs and
badges, and plain tables that do not need a grid's keyboard model. All
additive: without the new options 0.3.0 behaviour is unchanged (§8.25–§8.34).

### Added

- **Real-browser tests** (`pnpm test:e2e`): Playwright in Chromium, Firefox and WebKit
  for focus and tab order of widgets in cells (§8.35). Dev-only; not published.

- **Interactive cell contents** (APG grid pattern). A key pressed on a
  link, button, input or select *inside* a body cell is no longer
  intercepted: the caret moves, a select opens, a link follows. `Escape`
  returns focus to the cell. Widgets in body cells are `tabindex="-1"`
  so Tab leaves the grid in one step; `Enter` on a cell that holds one
  enters it (its widgets become tab stops while focus is inside). The
  grid's own controls carry `data-grid-own` and keep following grid keys.
- `mode: "grid" | "table"`. `"table"` is `role="table"` with `role="cell"`
  cells, no roving tab stop and no grid keyboard handler; sort buttons,
  selection controls and widgets are ordinary tab stops. For data that is
  read, not navigated.
- `DataGridColumn.headerCell` (header content snippet; `header` stays the
  accessible name), `.rowHeader` (`<th scope="row" role="rowheader">`),
  `.align`, `.cellClass`, `.cellAttrs`.
- Grid props `rowClass`, `rowAttrs`, `onRowActivate(row, id)` (Enter on a
  cell with no widget; a click outside any widget), `empty` and `footer`
  snippets, `busy` (`aria-busy`).
- `scroll` (default true): the table sits in a named
  `data-grid-scroll` `role="region"`; in table mode the region is a tab
  stop so a keyboard user can scroll it.

## 0.3.0 — 2026-10-10

Accessibility and correctness audit; each fix has a test that failed
before it (spec/index.md §8.20–§8.24).

### Fixed

- Clicking a cell did not move the roving tab stop, so the next arrow
  key jumped from wherever keyboard focus had last been. A `focusin`
  handler now moves it to the focused cell.
- Filtering away the focused row, changing to a shorter page, or hiding
  the focused column left no cell with `tabindex="0"`, so the grid
  dropped out of the tab order. The tab stop is now clamped to the
  cells that exist.
- Every focused body cell was announced as "selected": the headless
  `DataTableTD` set `aria-selected` on its active cell. The grid
  overrides it; selection lives on the row only. (Also fixed at the
  source the same day: `active` on `DataTableTD`, `GanttTableTD` and
  `KanbanTableTD` no longer sets `aria-selected`.)

### Added

- `aria-rowcount` on the grid and `aria-rowindex` on every row when
  paginated, so a screen reader reports a row's place in the whole list.
- `labels.pageAnnouncement(page, pageCount)`: page changes are announced,
  as the shared data-grid contract already required.
- `DataGridColumn.compare` for a consumer-supplied sort order, e.g. an
  `Intl.Collator` (the grid still picks no locale).
- `aria-valuemin` on the column resize handle.

## 0.2.0 — 2026-10-09

Lessons from an external practitioner write-up on profiling a large
Svelte 5 data grid (source redacted; see spec/index.md §11), applied
after reviewing this component against them.

### Fixed

- Default row ids were the row's index on the **current page**, so the
  first row of page 2 reused page 1's id `"0"`, and sorting moved ids
  between rows (a selected row could appear to change). Ids now come
  from each row's position in `rows`, computed once (§8.17).
- Shift-range selection mixed page and whole-list indexes on any page
  after the first (§8.17).

### Changed

- Sorting reads each row's key once instead of twice per comparison;
  filtering builds one search index per `rows`/`columns` change instead
  of reformatting every cell on every keystroke; selection lookups use a
  `Set` (§8.18). Column widths and hidden columns are `$state.raw`.

### Moved

- Out of `lily-design-system-svelte-helpers` into its own top-level
  subproject, `lily-design-system-svelte-data-grid`, with its own
  toolchain (`package.json` devDependencies and scripts, lockfile,
  vite/vitest config, `build.js`) and git subtree. The npm package name
  is unchanged; `repository.url` now names the standalone repository.

### Added

- `DataGridColumn.cell`, a typed snippet cell renderer receiving
  `{ value, formatted, row, column }`; new exported type
  `DataGridCellContext` (§8.19).
- Spec guidance to hold `rows` in `$state.raw` (§6), and the
  `$effect.pre` / `$state.raw` constraints any future virtualization
  must meet (§9).

## 0.1.0 — 2026-09-21

Initial release. Proposed and specced in
[spec/helpers/index.md § data-grid contract](../spec/helpers/index.md),
then implemented here as the canonical (and, for now, only) catalog.
Composes `@lilydesignsystem/svelte-headless`'s `DataTable` family
rather than duplicating a `<table>` implementation. Ships sort
(single-column, tri-state), client-side filter, row selection
(single/multiple with Shift-range and Ctrl/Cmd-toggle), column resize
(pointer + keyboard) and visibility, client-side pagination, the
WAI-ARIA APG Grid roving-tabindex keyboard contract, `aria-live` state
announcements, and optional `localStorage` persistence of view state
(column widths, hidden columns, sort — never row data or selection).
Virtualization, inline editing, column reorder/pin, row grouping,
server-side data, CSV export, and row drag-reorder are documented v1
non-goals, not gaps — see spec/index.md §9.

---

Lily™ and Lily Design System™ are trademarks.
