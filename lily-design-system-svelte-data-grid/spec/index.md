# DataGrid — Specification (Svelte helper)

Canonical contract for `@lilydesignsystem/svelte-data-grid`. Proposed
2026-09-21 in [spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md).
This package is the first implementation; no other framework catalog
ports it yet.

## 1. Purpose

A headless control that turns a plain array of rows into an
interactive data grid: sortable, filterable, selectable, with
resizable/hidable columns and pagination, keyboard-navigable per the
WAI-ARIA APG Grid pattern. The component owns state and behaviour; it
does not own the grid's base markup.

## 2. Scope

In scope: sort (single-column, tri-state), client-side filter, row
selection (none/single/multiple), column resize (pointer + keyboard),
column show/hide, client-side pagination, APG grid roving-tabindex
keyboard navigation, `aria-live` state announcements, and optional
persistence of view state (column widths, hidden columns, sort — never
row data or selection) to `localStorage`.

Out of scope (v1 non-goals, not silent gaps — see §9): virtualization/
windowing, inline cell editing, column reorder, column pinning, row
grouping/aggregation, server-side sort/filter/pagination, CSV export,
drag-to-reorder rows. Each requires either real layout/scroll ownership
(virtualization, row drag) that conflicts with "no bundled CSS, no
rendering opinion," or is a v2-sized feature better designed once v1
ships and is exercised in a real app.

## 3. Composition

`DataGrid` depends on `@lilydesignsystem/svelte-headless`'s `DataTable`,
`DataTableHead`, `DataTableBody`, `DataTableRow`, `DataTableTH`,
`DataTableTD` as a real npm dependency and renders them unmodified —
the same "depend on, don't vendor" rule `picker-bar` follows for its
four wrapped pickers. `DataTable` keeps owning `<table role="grid">`
and its `aria-label`; `DataTableTD`'s existing `active` prop (roving
`tabindex`/`aria-selected`) is reused as-is for body cells. `DataGrid`
never re-implements a `<table>`.

## 4. HTML

```
<div class="data-grid {class}">
  <div class="data-grid-toolbar">                 <!-- only if labels.search or a hidable column is set -->
    <input class="data-grid-search" type="search" aria-label="{labels.search}">
    <fieldset class="data-grid-column-visibility">  <!-- only if any column is hidable -->
      <legend>{labels.columnVisibility}</legend>
      <label><input type="checkbox"> {labels.columnVisibilityOption(header)}</label>
    </fieldset>
  </div>

  <DataTable label="{label}" caption="{caption}">
    <DataTableHead>
      <DataTableRow>
        <DataTableTH>                              <!-- only if selectionMode !== "none" -->
          <input type="checkbox">                  <!-- only if selectionMode === "multiple" -->
        </DataTableTH>
        <DataTableTH aria-sort="ascending|descending|none">
          <button class="data-grid-sort-button">{header}</button>  <!-- only if sortable -->
          <span class="data-grid-resize-handle" role="separator" aria-orientation="vertical">  <!-- only if resizable -->
        </DataTableTH>
      </DataTableRow>
    </DataTableHead>
    <DataTableBody>
      <DataTableRow>
        <DataTableTD><input type="checkbox|radio"></DataTableTD>   <!-- only if selectionMode !== "none" -->
        <DataTableTD>{formatted cell value}</DataTableTD>
      </DataTableRow>
    </DataTableBody>
  </DataTable>

  <div class="data-grid-pagination">              <!-- only if pageSize is set -->
    <button class="data-grid-page-previous">{labels.previousPage}</button>
    <span class="data-grid-page-status">{labels.pageStatus(page, pageCount, rowCount)}</span>
    <button class="data-grid-page-next">{labels.nextPage}</button>
  </div>

  <p class="data-grid-status" aria-live="polite"></p>
</div>
```

With `scroll` (the default) the `DataTable` sits inside
`<div class="data-grid-scroll" role="region" aria-label="{label}">`; an
`empty` snippet adds one `<DataTableRow>` whose cell spans every column;
a `footer` snippet adds a `<DataTableFoot>`; a `rowHeader` column's body
cells are `<DataTableTH scope="row">`.

## 5. Props

| Prop                | Type                                                                  | Required | Default    |
| ------------------- | ---------------------------------------------------------------------- | -------- | ---------- |
| `label`              | `string`                                                                | yes      | —          |
| `columns`            | `DataGridColumn[]`                                                     | yes      | —          |
| `rows`               | `Record<string, unknown>[]`                                            | yes      | —          |
| `caption`            | `string`                                                                | no       | —          |
| `rowId`              | `(row, index) => string` — `index` is the row's position in `rows`    | no       | `String(index)` |
| `selectionMode`      | `"none" \| "single" \| "multiple"`                                      | no       | `"none"`   |
| `selected`           | `string[]`, bindable                                                    | no       | `[]`       |
| `onSelectionChange`  | `(ids: string[]) => void`                                               | no       | —          |
| `filter`             | `string`, bindable                                                      | no       | `""`       |
| `onFilterChange`     | `(filter: string) => void`                                              | no       | —          |
| `sort`               | `{ columnId: string; direction: "ascending"\|"descending"\|"none" }`, bindable | no       | `{ columnId: "", direction: "none" }` |
| `onSortChange`       | `(sort) => void`                                                        | no       | —          |
| `pageSize`           | `number`                                                                | no       | —          |
| `page`               | `number`, bindable                                                      | no       | `1`        |
| `storageKey`         | `string`                                                                | no       | —          |
| `labels`             | `DataGridLabels`                                                        | no       | `{}`       |
| `mode`               | `"grid" \| "table"` — `"table"` is a plain sortable/filterable/pageable table with ordinary tab stops and no grid keyboard model (§6 "Table mode") | no       | `"grid"`   |
| `rowClass`           | `(row) => string` — extra class on each body row                         | no       | —          |
| `rowAttrs`           | `(row) => Record<string, unknown>` — extra attributes on each body row (e.g. `data-testid`) | no | —          |
| `onRowActivate`      | `(row, id) => void` — Enter on a body cell with no widget in it, or a click outside any widget | no | —          |
| `empty`              | `Snippet` — shown in one row spanning every column when no row matches   | no       | —          |
| `footer`             | `Snippet<[{ columns, rows }]>` — rendered inside a `<tfoot>`; the consumer supplies its rows | no | —          |
| `busy`               | `boolean` — sets `aria-busy` on the table                                | no       | `false`    |
| `scroll`             | `boolean` — wrap the table in a scrollable `data-grid-scroll` region     | no       | `true`     |
| `class`              | `string`                                                                | no       | `""`       |

`DataGridColumn`: `id` (required), `header` (required), `accessor?:
(row) => unknown` (default `row[id]`), `format?: (value, row) =>
string` (default `String(value)`, `""` for `null`/`undefined`),
`sortable?`, `filterable?` (default `true`), `resizable?`, `hidable?`,
`width?: number` (px), `compare?: (a, b) => number` (orders two raw
non-null values when sorting — pass e.g. an `Intl.Collator`'s `compare`
for locale-aware text order; the grid picks no locale itself, so the
default is plain `<`/`>`; `null`/`undefined` sort last regardless),
`cell?: Snippet<[DataGridCellContext]>` (default:
the formatted value as text), `headerCell?: Snippet<[{ column }]>` (the
header's content in place of the `header` text, which stays the
accessible name and the text of the column-visibility control),
`rowHeader?: boolean` (body cells of this column are `<th scope="row"
role="rowheader">`), `align?: "start" | "center" | "end"` (sets
`data-align` and `text-align` on its cells), `cellClass?: string |
((ctx) => string)` and `cellAttrs?: (ctx) => Record<string, unknown>`
(per body cell, where a consumer puts a status class or a
`data-testid`). `DataGridCellContext` is `{ value,
formatted, row, column }` — a typed Svelte 5 snippet rather than a slot,
so a consumer's link, badge, or icon cell typechecks against the row
type end to end, and `format` still feeds the filter (§6) even when
`cell` replaces what is shown.

`DataGridLabels` — every field optional, but **its presence gates the
control it names**, matching `share-picker`'s `copyLabel` and
`date-time-picker`'s `clear`/`timeZone` pattern; there is no baked-in
English fallback for any of them: `search`, `columnVisibility`,
`columnVisibilityOption(header)`, `resizeHandle(header)`, `selectAll`,
`selectionColumn`, `selectRow(rowLabel)`, `previousPage`, `nextPage`,
`pageStatus(page, pageCount, rowCount)`, `pageAnnouncement(page,
pageCount)`, `sortAnnouncement(header,
direction)`, `filterAnnouncement(matchCount, totalCount)`,
`selectionAnnouncement(selectedCount)`.

## 6. Behaviour

**Sorting** is single-column and tri-state. Clicking (or Enter/Space
on) a sortable column's header cycles `ascending → descending → none →
ascending`; choosing a different sortable column replaces the active
one outright rather than adding a second sort key. `"none"` restores
the pre-sort (but still filtered) row order. The active column's `<th>`
carries `aria-sort` reflecting the current direction (`"none"` is a
legal `aria-sort` value meaning "sortable, not currently sorted," not
"no information," so every sortable column carries `aria-sort` at all
times); non-sortable columns never carry the attribute.

**Filtering** is client-side, case-insensitive substring match against
every `filterable` column's formatted cell value (default
`filterable: true`). It renders only when `labels.search` is set — an
unlabelled search box is worse than none.

**Row identity.** Each row's id is computed once, as `rowId(row,
index)` with `index` its position in `rows` — never its position after
sorting, filtering, or on the current page. Ids therefore survive every
view change: the first row on page 2 is not id `"0"` again, sorting a
selected row elsewhere keeps it selected, and the body's `{#each}` is
keyed by that id so a row that only moves is moved, not re-rendered. A
consumer whose `rows` array is replaced with reordered or inserted data
should pass a `rowId` that reads a real key from the row.

**Hot-path cost.** Sort, filter and selection are the work a large grid
repeats; each is shaped so its cost does not multiply (§8.18):
sorting reads each row's key once and sorts the keys (n accessor
calls, not two per comparison); filtering builds one lowercased search
index per `rows`/`columns` change and reuses it across keystrokes,
instead of reformatting every cell each time; selection membership is
a `Set` derived from `selected`, not `selected.includes` per row. View
state that is always replaced wholesale (`columnWidths`,
`hiddenColumnIds`) is `$state.raw` — no deep proxy to build or read
through.

**Consumer guidance: hold `rows` in `$state.raw`.** The grid reads
`rows` but never mutates it. A consumer that holds its rows in plain
`$state` makes Svelte wrap every row in a deep reactive proxy, and
every accessor read in sort and filter then goes through that proxy;
practitioner profiling of a large Svelte 5 grid (see §11) reported
sort-and-filter dropping from about 80ms to about 6ms on moving the
rows to `$state.raw`, where only the array reference is reactive. So:
`let rows = $state.raw(data)`, and update by assigning a new array
(`rows = [...rows, row]`), never by mutating in place.

**Selection.** `"single"` keeps at most one id in `selected`, and
clicking a selected row's control clears it. `"multiple"` adds a
header select-all control reflecting all/some/none of the currently
sorted-and-filtered rows selected (checked / `indeterminate` / unchecked),
Shift-click extends a contiguous range from the last-touched row, and
Ctrl/Cmd-click toggles one row without clearing the rest. Every change
fires `onSelectionChange` with the new id array.

**Column resize** accepts pointer drag on `data-grid-resize-handle`
and, independently, `ArrowLeft`/`ArrowRight` when that handle itself
is focused (its own tab stop, outside the grid's roving-tabindex
system — a resize handle is not a grid cell). Width is clamped to a
40px minimum either way.

**Column visibility.** Hiding a `hidable` column removes its `<th>`
and every row's corresponding `<td>` from the DOM outright — not a
`hidden` attribute or `display: none` — so the grid's true column
count (and any assistive-technology column traversal) reflects reality
rather than a column that is still there but invisible.

**Pagination**, when `pageSize` is set, slices the sorted-and-filtered
rows for the current `page` (1-indexed, clamped to `[1, pageCount]`);
changing `page` re-renders only `DataTableBody`.

**Keyboard** follows the WAI-ARIA APG Grid pattern's roving-tabindex
model (never `aria-activedescendant` — the browser auto-scrolls a
focused *element* into view, which an `aria-activedescendant` cursor
does not get for free). Exactly one cell in the whole grid carries
`tabindex="0"` at a time; every other cell carries `tabindex="-1"`.
The selection column, when present, is grid column `0`; data columns
follow. `ArrowRight`/`ArrowLeft` move one column and clamp at the
row's ends; `ArrowUp`/`ArrowDown` move one row and clamp at the header
row (`-1`) and the last body row; `Home`/`End` jump to the current
row's first/last column; `Ctrl+Home`/`Ctrl+End` jump to the grid's
first/last cell; `PageUp`/`PageDown` move by `pageSize` rows (or 10
when `pageSize` is unset), clamped. `Enter`/`Space` on a focused
sortable header cell triggers that column's sort exactly as a pointer
click would; on a focused selection cell, toggles that row's (or all
rows', for the header select-all cell) selection.

The roving position follows focus however it arrives: a pointer click
or programmatic `focus()` on a cell moves it there (`focusin`), so the
next arrow key moves from the cell the user is actually on. It is also
clamped to the cells that currently exist — when filtering, paging, or
hiding a column removes the cell it named, the nearest remaining cell
becomes the tab stop, so the grid never drops out of the tab order.

**Interactive cell contents.** A `cell` snippet may hold links,
buttons, inputs and selects. The grid follows the APG grid pattern's
rule for these: a key pressed while focus is **on a widget inside a
cell** (the target is not the cell itself, and not one of the grid's own
controls, which carry `data-grid-own`) is left alone — the grid does not
`preventDefault`, so the caret moves in a text field, a select opens, a
link follows its address — except `Escape`, which returns focus to the
cell. Widgets inside body cells are not tab stops (`tabindex="-1"`), so
Tab still leaves the grid in one step: `Enter` on a cell that contains
one moves focus to the first (and, while focus is inside that cell, its
widgets are tab stops, so Tab moves between them; they revert when focus
leaves the cell). `Enter` on a cell with no widget calls
`onRowActivate(row, id)`; so does a click outside any widget.

**Table mode.** `mode="table"` is for data that is read, not navigated.
The element is `role="table"` and its cells `role="cell"`; no cell is a
roving tab stop and the grid's keyboard handler and `aria-rowcount`
bookkeeping are not installed. Sort buttons, selection controls and
widgets in cells are ordinary tab stops. Sorting, filtering, selection,
pagination, resizing and every slot work as in grid mode. Use it whenever
nobody needs two-dimensional arrow-key navigation.

**Empty, footer, busy, scroll.** With no row to show (nothing, or nothing
matching the filter) and an `empty` snippet, one row whose single cell
spans every column renders it; the grid renders no such row without the
snippet. A `footer` snippet renders inside a `<tfoot>`, given the
visible columns and the rows of the current page. `busy` sets
`aria-busy="true"` on the table. Unless `scroll` is `false`, the table is
wrapped in a `<div class="data-grid-scroll" role="region">` named by
`label`, so a table wider than its container scrolls inside it instead of
widening the page; in table mode, where no cell is focusable, the region
itself is a tab stop so a keyboard user can scroll it.

**Focus is not selection.** Body cells never carry `aria-selected`;
selection lives on the row (`<tr aria-selected>`) only when
`selectionMode !== "none"`. The headless `DataTableTD`'s `active` prop
used to set `aria-selected="true"` on the focused cell as well, which
announced every focused cell as "selected"; that was fixed at the
source on 2026-10-10 (the cell contract now says `active` sets only
`tabindex`). `DataGrid` still passes `aria-selected={undefined}` to its
cells, so it stays correct against a published headless version that
predates the fix.

**Announcements.** Every sort, filter, selection, and page change writes a
string to a single `data-grid-status` `aria-live="polite"` region,
built from the matching `labels.*` function — never a hardcoded
sentence. No announcement is attempted for a control whose label
(and therefore the control itself) is absent.

**Persistence.** `storageKey`, when set, persists exactly three things
to `localStorage`, try/catch-guarded like every other helper's
persistence: column widths, hidden column ids, and sort state. Row
data and `selected` are never persisted — a stored selection pointing
at rows that no longer exist is a worse failure mode than an
unselected grid on reload.

**SSR.** All DOM and `localStorage` access happens inside the
framework's mount/effect lifecycle; server render emits `rows`
unsorted, unfiltered, and on page 1.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, inherited from `DataTable`).
Roving-tabindex focus management, not `aria-activedescendant` (see §6).
`aria-sort` on every sortable header, reflecting live state. Hiding a
column removes its cells outright rather than leaving stale
`aria-colcount` bookkeeping to get wrong. When `pageSize` is set, the
DOM holds one page of a larger set, so the grid carries `aria-rowcount`
(all sorted-and-filtered rows plus the header row) and every row carries
its 1-based `aria-rowindex` (header `1`, then its position in the whole
sorted-and-filtered list), letting a screen reader say "row 4 of 6" on
page 2. Without pagination every row is in the DOM and neither is set.
The column resize handle exposes `aria-valuenow` and `aria-valuemin`
(40). State changes
are announced through one live region rather than relying on visual
change alone. In `mode="table"` the element is `role="table"` (the
headless `role="grid"` is overridden) and cells are `role="cell"`; a
`rowHeader` column's cells are `role="rowheader"`; a scroll region is
named and, where no cell is focusable, itself focusable (WCAG 2.1.1).
Keys pressed on a widget inside a cell are never swallowed (§6).

## 8. Acceptance criteria

- §8.1 Renders `<div class="data-grid">` wrapping a `DataTable` whose
  `role="grid"` and `aria-label` come from `label`.
- §8.2 Every `sortable` column renders a `data-grid-sort-button`;
  clicking or pressing Enter/Space on it cycles
  `ascending → descending → none → ascending` and updates that
  column's `<th aria-sort>` to match; a non-sortable column never
  carries `aria-sort`.
- §8.3 Sorting reorders `DataTableBody` rows by the active column's
  value (via `accessor` when supplied); `"none"` restores filtered-but-unsorted order.
- §8.4 `data-grid-search` renders only when `labels.search` is set,
  and filters rows by case-insensitive substring match across every
  `filterable !== false` column's formatted value.
- §8.5 `selectionMode="single"` keeps at most one id in `selected`,
  rendering one radio-equivalent control per row; re-choosing the
  selected row clears it.
- §8.6 `selectionMode="multiple"` supports Shift-range and Ctrl/Cmd-toggle
  selection, and its header select-all control reflects
  all/some/none of the sorted-and-filtered rows selected.
- §8.7 `selected` is two-way bindable; `onSelectionChange` fires with
  the new id array on every change.
- §8.8 A `resizable` column renders a `data-grid-resize-handle`;
  pointer drag and `ArrowLeft`/`ArrowRight` (handle focused) both
  resize it, clamped to a 40px minimum.
- §8.9 A `hidable` column can be hidden via the column-visibility
  control; hiding removes its `<th>` and every row's `<td>` from the
  DOM outright.
- §8.10 `pageSize` renders a `data-grid-pagination` footer
  (`data-grid-page-previous` / `data-grid-page-status` /
  `data-grid-page-next`) and `DataTableBody` renders only the current
  page's rows.
- §8.11 Exactly one cell (`.data-table-th` or `.data-table-td`) carries
  `tabindex="0"` at any time; arrow keys move it and clamp at the grid's
  edges rather than wrapping.
- §8.12 `Home`/`End` move within the current row; `Ctrl+Home`/`Ctrl+End`
  move to the grid's first/last cell.
- §8.13 Sort, filter, and selection changes each write an announcement
  to `data-grid-status` (`aria-live="polite"`) built from the matching
  `labels.*` function; no announcement fires for a control whose label
  is absent.
- §8.14 `storageKey` persists column widths, hidden columns, and sort
  state to `localStorage` and restores them on a fresh mount; it never
  persists `rows` or `selected`.
- §8.15 Extra attributes spread onto the root `<div>`.
- §8.16 No virtualization: every row of the current page renders
  eagerly, with no windowing/recycling machinery — documented non-goal,
  not an oversight.
- §8.17 Default row ids come from each row's position in `rows`: the
  first row on page 2 does not reuse page 1's id, a row keeps its id
  when sorting moves it, and Shift-range selection on a later page
  selects that page's rows.
- §8.18 Sorting calls a column's `accessor` at most once per row;
  successive filter keystrokes reuse one search index, calling a
  column's `format` at most once per row in total rather than once per
  row per keystroke.
- §8.19 A column's `cell` snippet, when set, renders each of its body
  cells and receives `value`, `formatted`, `row`, and `column`.
- §8.20 Focusing a cell by pointer moves the roving position to it, so
  arrows move from that cell; filtering away the focused row or hiding
  the focused column still leaves exactly one tabbable cell; no body
  cell carries `aria-selected`.
- §8.21 With `pageSize` set, the grid carries `aria-rowcount` (rows plus
  header) and each row its `aria-rowindex` in the whole list.
- §8.22 Changing page writes `labels.pageAnnouncement(page, pageCount)`
  to `data-grid-status`.
- §8.23 The resize handle carries `aria-valuemin="40"`.
- §8.24 A column's `compare` orders its sort.
- §8.25 A key pressed on a link, button, input or select inside a body
  cell is not `preventDefault`ed and does not move the roving position;
  `Escape` on such a widget focuses its cell. The grid's own controls
  (selection inputs, sort buttons) still follow grid keys.
- §8.26 Widgets inside body cells carry `tabindex="-1"`; `Enter` on a
  cell that contains one focuses the first, and while focus is inside the
  cell its widgets are `tabindex="0"`, reverting when focus leaves.
- §8.27 `mode="table"` renders `role="table"` with `role="cell"` cells, no
  cell with a `tabindex`, no grid key handling, and sort buttons and
  selection inputs without `tabindex="-1"`.
- §8.28 A `rowHeader` column's body cells are `<th scope="row"
  role="rowheader">`.
- §8.29 `rowClass`, `rowAttrs`, a column's `cellClass`, `cellAttrs` and
  `align` reach the DOM on every body row and cell.
- §8.30 A column's `headerCell` snippet replaces the header text, inside
  the sort button when sortable, and `header` stays the accessible name of
  the column-visibility control.
- §8.31 With no matching row, an `empty` snippet renders in one cell
  spanning every visible column; without the snippet, no extra row.
- §8.32 A `footer` snippet renders inside a `<tfoot>`; `busy` sets
  `aria-busy`.
- §8.33 The table sits in a `data-grid-scroll` region named by `label`
  unless `scroll` is `false`; the region is a tab stop only in table mode.
- §8.34 `Enter` on a body cell without a widget, and a click outside any
  widget, call `onRowActivate(row, id)`; neither fires for a click on a
  widget.

- §8.35 Real-browser checks (`pnpm test:e2e`, Playwright in Chromium, Firefox
  and WebKit, `e2e/widgets.spec.ts` against `e2e/harness/`) cover what jsdom
  cannot judge for §8.25, §8.26 and §8.34: Tab never lands on a body widget
  until its cell is entered, Enter on a cell enters it and Tab moves between
  its widgets, the widgets revert to `tabindex="-1"` on leaving, arrow keys
  and typing stay in an input, Escape returns focus to the cell, and a click
  on a widget moves the roving position without activating the row.

## 9. Non-goals

Row grouping/aggregation, server-side sort/filter/pagination,
drag-to-reorder rows. (CSV export left this list in 0.7.0: §14.) See §2 and
[spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md)
for the reasoning behind each.

If virtualization is ever reconsidered (v2), two lessons from §11 apply
before any code: measure the viewport in `$effect.pre`, not `$effect` —
the window size must be known before the paint that uses it, or the
first frame renders rows at zero height — and keep the row backing in
`$state.raw` so scroll-driven re-slicing never walks a deep proxy. The
accessibility objection in §2 (exact `aria-rowcount`/`aria-rowindex`
bookkeeping, broken screen-reader traversal otherwise) still stands
and is the deciding constraint, not performance.

## 10. Relationship to the headless layer and other helpers

`DataGrid` is the first helper to depend on `@lilydesignsystem/svelte-headless`
rather than being fully self-contained — a new composition shape,
distinct from `picker-bar` (which composes sibling *helpers*, not a
headless dependency). It reuses `DataTableTD`'s existing `active` prop
for body-cell roving tabindex rather than re-deriving that logic, and
follows every other helper's established rules: headless (no bundled
CSS), SSR-safe, i18n-clean (§5's label-gating pattern mirrors
`share-picker`'s `copyLabel` and `date-time-picker`'s `labels`),
try/catch-guarded `localStorage`, and Svelte-canonical-first.

## 11. Research notes

**Profiling a large Svelte 5 data grid (practitioner write-up, read
2026-10-09).** An external project's author published lessons from
profiling their own Svelte 5 grid; the source is not cited here, and
the project, author and product are deliberately left unnamed. The
numbers are the author's own, on a dataset whose size and hardware
were not stated — treat them as direction, not a benchmark. What Lily
took from it:

- *A data grid is a reactivity problem first.* The goal is to repaint
  only the cells that changed. Lily's response: stable, position-in-`rows`
  row ids and a keyed body `{#each}` (§6 "Row identity", §8.17).
- *Deep proxies are the dominant cost at scale.* Svelte's deep `$state`
  proxy suits forms and costs heavily on tens of thousands of rows;
  moving the row backing to `$state.raw` (array reference reactive,
  contents not) took sort-and-filter from ~80ms to ~6ms. Lily's
  response: `$state.raw` for the grid's own wholesale-replaced view
  state, and consumer guidance to hold `rows` the same way (§6).
- *Typed snippets beat slots for cell renderers.* Passing a snippet on
  the column definition keeps the cell's arguments typechecked all the
  way through. Lily's response: `DataGridColumn.cell` (§5, §8.19).
- *Measure before paint with `$effect.pre`.* Only relevant to
  virtualization, which stays a non-goal; recorded in §9 for v2.
- *Separate headless core from render component.* Lily already does
  this at a higher level: `data-grid` owns state and behaviour and the
  headless `DataTable` family owns the markup (§3).

The write-up's own feature list (Excel-style filter menus, server-side
row model, transactions, 1M-row virtualization) was not adopted: each
is either an existing v1 non-goal (§9) or out of scope for a headless
helper.

Reviewing the component against these lessons also surfaced two real
defects, fixed in 0.2.0: default ids were the row's index **on the
current page**, so page 2's first row reused page 1's id `"0"` and
sorting moved ids between rows; and Shift-range selection mixed page
and whole-list indexes. Plus three avoidable multipliers in the hot
path: an accessor call twice per sort comparison, every cell reformatted
on every filter keystroke, and `selected.includes` per row (§6
"Hot-path cost", §8.18).

## 12. Shipped in 0.5.0 (2026-10-14)

Tests §8.40–§8.46.

- **Column reordering**: `column.movable` headers are draggable and Alt+ArrowLeft/Right on a focused header moves the column (the keyboard
  alternative, WCAG 2.5.7). `columnOrder` is bindable; columns it does not name follow in their `columns` order; hidden columns keep their
  place when a visible one moves. `onColumnOrderChange(order)`; `labels.columnMoveAnnouncement(header, position, count)`.
- **Pinned columns**: `column.pinned` puts `data-pinned="start" | "end"` on the header and cells. Lily sets no sticky offsets.

## 13. Cell editing and virtualization (0.6.0, 2026-10-16)

Tests §8.47–§8.56. Both were listed as non-goals in §9; the accessibility objection to virtualization (exact `aria-rowcount` / `aria-rowindex`) is met by always setting them, as `kanban-board` does.

- **Cell editing**: `column.editable`. F2 on a focused cell, Enter on one (before row activation and widget entry), a double click, or the `labels.editCell` button (the one path in `mode="table"`) opens a text or number input named `labels.cellEditor(header)` (the header by default). Enter commits, Escape cancels, blur commits. The value is `parse(draft, row)` (`Number(draft)` or `null` for the number editor, the text otherwise); `validate(value, row)` returning a message keeps the cell editing with `aria-invalid`, the message in `.data-grid-cell-error`, `labels.editError` announced. `onCellEdit({ rowId, row, columnId, value, previous })` fires only when the value changed; the grid never writes to `rows`.
- **Virtualization**: `virtualize: { rowHeight, height, overscan = 3 }` (needs `scroll`) gives `.data-grid-scroll` an inline `height` and `overflow:auto` and renders only the window plus the roving tab stop's row, with `.data-grid-spacer` rows (`aria-hidden`) holding the height of the rest. Rows are assumed `rowHeight` tall; Lily measures nothing. Combines with `pageSize`.

## 14. Export to CSV, TSV and Excel (0.7.0, 2026-10-16)

Tests §8.57–§8.74 (`export-data.test.ts` and `DataGrid.test.ts`). The format code is `export-data.ts`, free of the grid and exported for reuse; the grid adds a thin layer of buttons.

- **What is exported**: the visible columns, in display order, minus `exportable: false` ones; the rows the filter leaves, in the current sort, across **every page** (`exportScope="selected"`: only the selected rows). Hidden columns are never exported. A cell is its `column.exportValue(row)` when given; otherwise a number, boolean or `Date` as itself and anything else as the text the grid shows (so `format` applies to text, while numbers stay numbers in Excel and are never locale-formatted).
- **Buttons**: `labels.exportCsv`, `exportTsv`, `exportExcel` each gate one `button.data-grid-export-button[data-grid-export-format]` in `div.data-grid-export[role=group]` named by `labels.export`, inside the toolbar. They are disabled with no rows. After the file is built `onExport({ format, filename, rowCount, blob })` runs; returning `false` stops the save (to upload the blob, say); otherwise the file is saved through a temporary link and `labels.exportAnnouncement(format, rowCount, filename)` is announced. File name: `exportFilename` (default `data-grid`) plus the extension, never doubled, with `\/:*?"<>|` replaced.
- **CSV / TSV** (RFC 4180): CRLF lines; a field is quoted when it holds the delimiter, a quote or a line break; quotes double. The grid's files start with a UTF-8 byte-order mark so Excel reads accents correctly (`bom` is off in the pure functions). **Formula injection**: a *string* starting with `=`, `+`, `-`, `@`, tab or CR gets a leading `'` (`safe`, default on); numbers and booleans, being typed, are never touched.
- **Excel**: a real .xlsx — a ZIP, stored without compression, of `[Content_Types].xml`, `_rels/.rels`, `xl/workbook.xml` (+ rels), `xl/styles.xml` and one worksheet; no dependency and a fixed ZIP timestamp, so the same table gives the same bytes. Text is an inline string (so `=1+1` stays text), numbers are numeric, booleans typed, a `Date` is a serial number with a date or date-time format, and empty cells are omitted. The header row is bold and frozen; the sheet name is `exportFilename` cleaned of `[]:*?/\` and cut to 31 characters. Verified against openpyxl.
- **Not included**: multiple sheets, column widths, number formats beyond dates, CSV import, copy-to-clipboard.

Deeper notes on screen-reader support, IME input and virtual scrolling for export: [excel-export/](excel-export/index.md).

The twelve cell types (text, number, link, date, time, time with time zone, select option, radio group, person, file, rollup, formulas) and how a first-class `column.type` would bundle their defaults: [cell-types/](cell-types/index.md).

## Remaining cell types (0.9.0) (2026-10-16)

Implements §3.6 and §3.9–§3.12 of [cell-types](cell-types/index.md) (tests §8.98–§8.114): `time-zone`, `person`, `file`, `rollup` and `formula` are now `column.type` values. Every one of the twelve cell types is shipped.

## 18. Search (0.10.0, 2026-10-17)

Tests §8.90–§8.94. Shared across the data grid, kanban board, Gantt chart and calendar (`search-text.ts`, a pure module with its own tests: `foldText`, `searchTerms`, `matchesSearch`, `highlightSegments`).

- **Words**: a query is split on whitespace; every word must appear (AND), in any order, ignoring case and diacritics ("cafe" finds "Café"). A blank query matches everything.
- **In the data grid**: the filter (`filter`, bindable; `labels.search` names the field) narrows the rows. Every word must appear somewhere in the row (any order, any filterable cells), ignoring case and diacritics; `filterText` still sets a column's text. No match highlighting: cells are rendered by their cell type, so the grid marks nothing inside them.
- Highlighting uses `<mark>` only while a search is active and works on the original text (never the folded one); where folding would change a string's length it marks nothing rather than the wrong span.

## Filtering and sorting (0.10.0, 2026-10-17)

- **`rowFilter(row)`** hides rows it rejects, combining with the text `filter` (both must pass).
- **Multi-column sort**: `thenBy` (bindable, with `onThenByChange`) holds further sort keys after `sort`. Shift+click on another sortable header adds it (ascending → descending → off); a plain click sets `sort` alone and clears `thenBy`. Each sort is read once per row per key and ties fall to the next key; missing values still sort last. Headers carry `aria-sort` for every key and `data-sort-order` (1 = primary) while more than one key is set; `labels.sortAnnouncement` announces the change.

## Export: copy to clipboard (0.10.0, 2026-10-17)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same rows, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.10.0, 2026-10-17)

- **Type-ahead**: letters typed in quick succession (within 700 ms) move the cursor to the next row whose cell text, in the column the cursor is in, starts with them (`findTypeaheadMatch`; the text is what the cell shows, ignoring case and diacritics). The same letter pressed again steps through the rows that start with it; a Ctrl, Alt or Meta key, and a prefix that matches nothing, do nothing. PageUp / PageDown already moved a page.

The matching is the pure `typeahead.ts` (`isTypeaheadKey`, `nextTypeaheadState`, `findTypeaheadMatch`), shared by the three grids and tested on its own.
