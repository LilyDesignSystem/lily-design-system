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
the formatted value as text). `DataGridCellContext` is `{ value,
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
change alone.

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

## 9. Non-goals

Virtualization/windowing, inline cell editing, column reorder, column
pinning, row grouping/aggregation, server-side sort/filter/pagination,
CSV export, drag-to-reorder rows. See §2 and
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
