# Changelog — `<gantt-chart>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.8.0 — 2026-10-18

- Added `criticalPath()` and `applyCriticalPath()` (all four dependency kinds, lags and leads in calendar or working days), copied from `shared/critical-path.ts`. Ported from the Svelte package.
- Added `labels.criticalLabel`: visible text (`.gantt-chart-critical-label`) beside the label of a task with `critical: true`, so the state is not colour-only and the task label, which "depends on" text reuses, stays unchanged. Ported from the Svelte package.

## 0.7.0 — 2026-10-17

- Markup follows the headless layer (built by hand here, not imported): the search field matches `SearchInput` and a match matches `Mark` (the `search-input` / `mark` base classes join the existing `*-search` / `*-match` hooks, so the 57 themes style them too). Keyboard movement (arrows, Home/End, page keys, right-to-left) comes from the shared `grid-navigation` module.
- Added right-to-left arrow keys (`isRtl`, `logicalKey`).
- Added `unavailable` (holidays, time off, closures as dated ranges): `data-unavailable` / `data-partly-unavailable` on columns and cells, label text in the header, theme shading and stripes.
- Added field `validate` (with `aria-invalid` and `labels.editRefused`) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `onFieldEdit` and the `fieldedit` event.
- Added PageUp / PageDown and type-ahead to the grid keyboard.
- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `onCopy`; `toClipboardText`, `copyToClipboard`).
- Added `filter` and `compare` (sibling order).
- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. The Gantt chart and calendar gain search (new).
- Ported from the Svelte 0.7.0; the pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.6.0 — 2026-10-17

- Added weekend shading: `weekends` (weekdays, 0 = Sunday … 6 = Saturday; never defaulted) marks day columns `data-weekend` on the header and every cell. The 57 reference themes tint them.
- Added dependency arrows: `dependencyArrows` draws an `aria-hidden` SVG arrow per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description remains.
- Exports `dependencyPath` and `weekdayOfEpochDay` (pure, tested).

## 0.5.0 — 2026-10-16

- Added typed task fields (`fields`, `task.values`, `locale`) as columns between the task name and the timeline, using the data grid's cell types.
- Added inline field editing (`onFieldEdit`): click a value, F2, Tab to the next field; typed editors, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `onExport`); dates are real dates in Excel.
- Added `virtualize` (windowed rows with spacers, `aria-rowcount` / `aria-rowindex`).
- Marker, today and task lookups are computed once per change instead of per cell.

## 0.4.0 — 2026-10-16

- Added unscheduled tasks, ported from the Svelte 0.4.0: a task with no `start` / `end` renders its row with no bar (`data-unscheduled`); Enter opens the edit region with empty dates and Save stays disabled until both are set, which schedules it through `onTaskChange`. An unscheduled child does not shape its parent's span; drag and Alt+Arrow do nothing for it.
- Added `collapsedTaskIds` (property; `onCollapsedTaskIdsChange` and a `collapsechange` event report user changes) and `labels.expandAll` / `labels.collapseAll` buttons that expand or collapse every parent task.

## 0.3.0 — 2026-10-14

- Added a progress field in the edit region, baselines and typed dependencies, ported from the Svelte 0.3.0.
- Added a zoom control, drag-resize handles, task selection, Alt+Arrow shift and resize, and `taskAttrs`, ported from the Svelte 0.3.0.

## 0.2.0 — 2026-10-14

- Added `readonly`, `markers`, `isNonWorking`, and task `type`, `critical` and `slack` data hooks, ported from the Svelte 0.2.0.

## Unreleased — 2026-10-11

Fixed: row depth is `data-depth`, not an inline style; orphaned `parentId`s render as top-level rows and cycles no longer
hang; the edit region takes focus on open and returns it to the grid on Save/Cancel/Escape; a range entered end-first is
saved start-first and Save is disabled while a date is empty; collapse and edit controls do not render unnamed. Added
`labels.taskColumnHeader` and `effectiveRanges`. See the repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.0 — 2026-09-22

Initial implementation. Ported from the canonical
`@lilydesignsystem/svelte-gantt-chart`, adapted to this catalog's
vanilla-custom-element idiom: no `GanttTable` component dependency (this
catalog's headless `gantt-table` family is markup-contract
documentation, not a JS class), `range`/`tasks`/`taskLabel`/
`onTaskChange`/`labels` are property-only, and a `taskchange` event
pairs with the `onTaskChange` property. Reuses
`@lilydesignsystem/html-date-time-picker`'s own civil-date arithmetic
exports (`addDays`, `parseIsoDate`, `formatIsoDate`, `daysInMonth`,
`toEpochDay`) instead of re-porting them. Opening/closing a task's edit
region is a targeted single-`<tr>` insert/remove, not a structural
rebuild, so it never disturbs the roving-tabindex cursor's own DOM node.
See `spec/index.md` §10 for the full deviation list.
