# Changelog — DataGrid (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
