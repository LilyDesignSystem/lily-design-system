# Changelog — DataGrid (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
