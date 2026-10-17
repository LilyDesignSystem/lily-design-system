# DataGrid — Specification (Nunjucks helper)

Canonical contract for `@lilydesignsystem/nunjucks-data-grid`, ported from the canonical
[`@lilydesignsystem/svelte-data-grid`](../../lily-design-system-svelte-data-grid/spec/index.md)
(the reference implementation; see [spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md)
for the cross-catalog contract). Same behaviour, Nunjucks idioms. Where this file is silent the Svelte spec decides:
markup (its §4), behaviour (§6), accessibility (§7), non-goals (§9), cell editing and virtualization (§13),
export (§14, and [excel-export](../../lily-design-system-svelte-data-grid/spec/excel-export/index.md)) and the twelve
[cell types](../../lily-design-system-svelte-data-grid/spec/cell-types/index.md).

## 1. Purpose

A headless interactive data grid over `@lilydesignsystem/nunjucks-headless`'s unmodified `DataTable` family. It owns state and
behaviour; it ships no CSS and no English.

## 2. Composition

`DataGrid` renders `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableRow`, `DataTableTH` and
`DataTableTD` from `@lilydesignsystem/nunjucks-headless` (a real dependency, never vendored). `cell-types.ts` and `export-data.ts` are
byte-for-byte copies of the Svelte modules (pure TypeScript) and ship with their own tests.

## 3. Nunjucks idioms

- **Skeleton and config.** The macro emits a readable `<table>` and a `<script type="application/json" data-data-grid-config>`; `<` is escaped as `\u003c` so data cannot close the script.
- **Labels.** Function labels are template strings with `{placeholders}`; `resolveLabels` converts them.
- **Declarative columns.** No functions cross the macro boundary.
- **Deviation.** The skeleton shows raw values; typed formatting appears when the client runs.

## 4. Acceptance criteria

§8.1–§8.119 are the Svelte reference's clauses, each exercised in this package's tests with the same section number
(the `export-data` tests §8.57–§8.66, §8.78 and §8.115 run unchanged). Tests render the macro with Nunjucks and run the client in jsdom.

## 5. Relationship to the headless layer

Depends on `@lilydesignsystem/nunjucks-headless` as a regular dependency. This package has no Lily dependencies.

## 6. Release notes

See [CHANGELOG.md](../CHANGELOG.md). 0.9.0 is the first release: it is at the version of the Svelte package it ports.

## 18. Search (0.10.0, 2026-10-17)

Tests §8.90–§8.94. Shared across the data grid, kanban board, Gantt chart and calendar (`search-text.ts`, a pure module with its own tests: `foldText`, `searchTerms`, `matchesSearch`, `highlightSegments`).

- **Words**: a query is split on whitespace; every word must appear (AND), in any order, ignoring case and diacritics ("cafe" finds "Café"). A blank query matches everything.
- **In the data grid**: the filter (`filter`, controlled when given; `labels.search` names the field) narrows the rows. Every word must appear somewhere in the row (any order, any filterable cells), ignoring case and diacritics; `filterText` still sets a column's text. No match highlighting: cells are rendered by their cell type, so the grid marks nothing inside them.
- Highlighting uses `<mark>` only while a search is active and works on the original text (never the folded one); where folding would change a string's length it marks nothing rather than the wrong span.

## Filtering and sorting (0.10.0, 2026-10-17)

- **`rowFilter(row)`** hides rows it rejects, combining with the text `filter` (both must pass).
- **Multi-column sort**: `thenBy` (controlled when given, with `onThenByChange`) holds further sort keys after `sort`. Shift+click on another sortable header adds it (ascending → descending → off); a plain click sets `sort` alone and clears `thenBy`. Each sort is read once per row per key and ties fall to the next key; missing values still sort last. Headers carry `aria-sort` for every key and `data-sort-order` (1 = primary) while more than one key is set; `labels.sortAnnouncement` announces the change.

## Export: copy to clipboard (0.10.0, 2026-10-17)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same rows, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.10.0, 2026-10-17)

- **Type-ahead**: letters typed in quick succession (within 700 ms) move the cursor to the next row whose cell text, in the column the cursor is in, starts with them (`findTypeaheadMatch`; the text is what the cell shows, ignoring case and diacritics). The same letter pressed again steps through the rows that start with it; a Ctrl, Alt or Meta key, and a prefix that matches nothing, do nothing. PageUp / PageDown already moved a page.

The matching is the pure `typeahead.ts` (`isTypeaheadKey`, `nextTypeaheadState`, `findTypeaheadMatch`), shared by the three grids and tested on its own.

## In-place edit: validation, undo and redo (0.10.0, 2026-10-17)

- `validate` and `aria-invalid` on a refused cell were already there; undo and redo are new.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onCellEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onCellEdit`. `labels.undoAnnouncement(header, text)` / `labels.redoAnnouncement(header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Defaults, locale, fields, labels and direction (0.10.0, 2026-10-17)

- **Empty values.** `emptyValue` (grid) and a column's own `emptyValue` give a missing value (`null`, `undefined` or `""`) visible text such as `"—"`; Lily ships none. The cell always carries `data-empty` for CSS, and an export is unaffected. `nulls` (`"last"` default, or `"first"`) says where missing values sort, in both directions.
- **Locale-aware sorting.** With a `locale` (or a column's own), plain text sorts with `Intl.Collator(locale, { numeric: true })` — "Item 2" before "Item 10", an accented letter with its base letter. Without a locale text sorts by code point, as before. A column's own `compare` always wins; typed columns keep their type's comparison.
- **Field-specific search.** `filterField` (controlled when given, `onFilterFieldChange`) limits the text filter to one column; `labels.searchField` (the select's name) with `labels.searchAllFields` (its first option) shows the select, listing the filterable columns. Without a field the whole row is searched.
- **`movableColumns`** makes every column movable (Alt+Arrow on the header, or drag), unless a column's `movable` is `false`.
- **Right-to-left.** The horizontal arrows are visual, so in a right-to-left layout (the nearest `dir`, else the computed direction) ArrowLeft goes to the next cell and ArrowRight to the previous, and Alt+Arrow moves a column the way the arrow points. Vertical keys, Home, End and the page keys do not change. The pure `isRtl` / `logicalKey` are exported.
- **Labels.** `DataGridLabels` is the one bundle of every string. What each feature needs is listed in `CONTROL_LABELS` (labels that *name a control*) and `ANNOUNCEMENT_LABELS` (live-region messages), and `requiredLabels(features)` / `missingLabels(features, labels)` compute it, so an app can assert in a test that its bundle for a locale is complete. In development the grid logs once, naming the labels its features call for that `labels` leaves out (`warnMissingLabels={false}` silences it; it never logs in production). Lily has no English fallback: a missing label is a control with no name or an announcement never made. `sortAnnouncement` receives the ARIA token (`ascending`, `descending`, `none`), which the bundle turns into its own words.
- **Row attributes.** `rowAttrs(row)` returns attributes spread onto each body row — the way to put test ids (`data-testid`), data attributes and other hooks on rows (`rowAttrs={(row) => ({ "data-testid": `row-${row.id}` })}`); `rowClass` does the same for classes, and a column's `cellAttrs` / `cellClass` for cells.

Tests §8.117–§8.148.
