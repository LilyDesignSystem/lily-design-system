# Changelog — GanttChart (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

- Added `criticalPath()` and `applyCriticalPath()` (all four dependency kinds, lags and leads in calendar or working days), exported from the package and copied from `shared/critical-path.ts`. Ported from the Svelte package.
- Works with the label packs: `nunjucksLabelsFor()` gives the macro `labels` and the client option `labels`. `labels.dependencyDetail` may be an object of templates keyed by dependency type (`e2s`, `s2s`, `e2e`, `s2e`).
- Added `labels.criticalLabel`: visible text (`.gantt-chart-critical-label`) beside the label of a critical task.

## 0.7.0 — 2026-10-17

- Added search: `labels.search` renders a field that keeps the tasks by label and field text; every typed word must appear (any order), ignoring case and diacritics; matches are marked with `<mark class="mark gantt-chart-match">`; `labels.searchAnnouncement` announces the count; Escape clears.
- Added PageUp / PageDown, type-ahead on task labels, and right-to-left arrow keys (`isRtl`, `logicalKey`; `gridMove` from `shared/`).
- Added copy to the clipboard: `labels.copy` renders a button that puts the export (header row first, tab-separated) on the clipboard; `labels.copyAnnouncement`, `labels.copyFailed`, the client option `onCopy({ text, rowCount })` (return `false` to take over) and the `copy` event.
- Added field `validate` (the editor stays open with `aria-invalid`; `labels.editRefused` announces the reason) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) reported through `onFieldEdit` and the `fieldedit` event; `labels.fieldUndoAnnouncement` / `fieldRedoAnnouncement`.
- The task label is now wrapped in `<span class="gantt-chart-task-label" data-lily-gantt-chart-task-label-text>` (search marks inside it).
- Not yet ported from the Svelte package: the headless `SearchInput` / `Mark` composition (the client builds the same markup by hand), filter, sort, unavailable days.
- The pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.6.0 — 2026-10-17

- Added weekend shading: `weekends` (weekdays, 0 = Sunday … 6 = Saturday; never defaulted) marks day columns `data-weekend` on the header and every cell. The 57 reference themes tint them.
- Added dependency arrows: `dependencyArrows` draws an `aria-hidden` SVG arrow per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description remains.
- Exports `dependencyPath` and `weekdayOfEpochDay` (pure, tested).

## 0.5.0 — 2026-10-16

- Added typed task fields (`fields`, `task.values`, `locale`) as columns between the task name and the timeline, using the data grid's cell types.
- Added inline field editing (the macro's `editableFields`; the client option `onFieldEdit` reports each edit): click a value, F2, Tab to the next field; typed editors, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `onExport`); dates are real dates in Excel.
- Added `virtualize` (windowed rows with spacers, `aria-rowcount` / `aria-rowindex`).

## 0.4.0 — 2026-10-16

- Added unscheduled tasks, ported from the Svelte 0.4.0: a task with no `start` / `end` renders its row with no bar (`data-unscheduled`); Enter opens the edit region with empty dates and Save stays disabled until both are set, which schedules it through `onTaskChange`. An unscheduled child does not shape its parent's span; drag and Alt+Arrow do nothing for it.
- Added macro `collapsedTaskIds` (the client collapses those parents at init; `onCollapsedTaskIdsChange(ids)`, a `collapsechange` event and `collapsedTaskIds()` report changes) and plain-string `labels.expandAll` / `labels.collapseAll` buttons that expand or collapse every parent task.

## 0.3.0 — 2026-10-14

- Added a progress field in the edit region, baselines and typed dependencies, ported from the Svelte 0.3.0.
- Added a zoom control, drag-resize handles, task selection, Alt+Arrow shift and resize, and `taskAttrs`, ported from the Svelte 0.3.0.

## 0.2.0 — 2026-10-14

- Added `readonly`, `markers`, `isNonWorking`, and task `type`, `critical` and `slack` data hooks, ported from the Svelte 0.2.0.

## Unreleased — 2026-10-11

Fixed: row depth is `data-depth`, not an inline style; orphaned `parentId`s render as top-level rows and cycles no longer
hang; the edit region takes focus on open and returns it to the grid on Save/Cancel/Escape; a range entered end-first is
saved start-first and Save is disabled while a date is empty; collapse and edit controls do not render unnamed. Parent ranges are re-derived when a child changes on the client. Added `labels.taskColumnHeader`. See the repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.0 — 2026-09-22

Initial release. Ports `@lilydesignsystem/svelte-gantt-chart`
(proposed 2026-09-21) to this catalog's macro + client.js
architecture: a keyboard-and-pointer-accessible Gantt chart with row
hierarchy, milestones, percent-complete, finish-to-start dependency
data, a today marker, and a keyboard-accessible edit region composing
`@lilydesignsystem/nunjucks-date-time-picker` twice per session — the
first helper-to-helper macro composition in this catalog. Composes
`@lilydesignsystem/nunjucks-headless`'s gantt-table macro family
unmodified. The time-axis columns and every grid-body cell are built
by `gantt-chart.client.js` rather than the macro, since generating
them needs real civil-date arithmetic Nunjucks cannot do — see
spec/index.md §3. No other framework catalog's port is affected by
this release.
