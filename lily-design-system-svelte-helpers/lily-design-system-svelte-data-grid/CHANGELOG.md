# Changelog — DataGrid (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-21

Initial release. Proposed and specced in
[spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md),
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
