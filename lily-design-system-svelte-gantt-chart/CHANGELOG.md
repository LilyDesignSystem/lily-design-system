# Changelog — GanttChart (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.7.0 — 2026-10-17

- Added `filter` and `compare` (sibling order).
- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. The Gantt chart and calendar gain search (new).

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

- Added unscheduled tasks: a task with no `start` / `end` renders its row with no bar (`data-unscheduled`); Enter opens the edit region with empty dates and Save stays disabled until both are set, which schedules it through `onTaskChange`. An unscheduled child does not shape its parent's span; drag and Alt+Arrow do nothing for it.
- Added `collapsedTaskIds` (bindable) and `labels.expandAll` / `labels.collapseAll` buttons that expand or collapse every parent task.

## 0.3.0 — 2026-10-14

- Added a progress field in the edit region (`labels.percentLabel`; `onTaskChange` gets the clamped value as a 4th argument),
  baselines (`task.baseline`: cells get `data-baseline`; `labels.baselineSummary` gives hidden text with the slip in days) and typed
  dependencies (`dependsOn` accepts `{ id, type?, lag? }`; `labels.dependencyDetail` words them).
- Added a zoom control (`timeUnit` is bindable; `labels.zoomIn` / `zoomOut` / `zoomAnnouncement`), drag-resize handles on a task's bar
  ends, task selection (`selectedTaskId`, `onTaskSelect`; click or the `s` key), Alt+ArrowLeft/Right to shift a task one column and
  Alt+Shift+Arrow to move only its end, and `taskAttrs`.

## 0.2.0 — 2026-10-14

- Added `readonly`, `markers`, `isNonWorking`, and task `type`, `critical`
  and `slack` data hooks (ideas A1–A4 of the SVAR survey; spec §12).

## Unreleased — 2026-10-13

Docs only: `spec/index.md` §11 records a survey of SVAR Svelte Gantt and fifteen ranked ideas (`readonly`, `markers`,
`isNonWorking`, task `type`/`critical`/`slack` data, richer `dependsOn`, zoom as a controlled prop, unscheduled tasks,
baselines, split tasks, rollups, and what stays a non-goal). No code change.

## Unreleased — 2026-10-11

Fixed: row depth is `data-depth`, not an inline style; orphaned `parentId`s render as top-level rows and cycles no longer
hang; the edit region takes focus on open and returns it to the grid on Save/Cancel/Escape; a range entered end-first is
saved start-first and Save is disabled while a date is empty; collapse and edit controls do not render unnamed. Added
`labels.taskColumnHeader` and `effectiveRanges`. See the repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.0 — 2026-09-22

Initial release. Proposed and specced in
[spec/helpers/index.md § gantt-chart contract](../spec/helpers/index.md),
then implemented here as the canonical (and, for now, only) catalog.
Composes `@lilydesignsystem/svelte-headless`'s `GanttTable` family
(structural, task bars as column-spanning cells rather than
pixel-positioned floating divs) and `@lilydesignsystem/svelte-date-time-picker`
— used twice per edit session, for a task's start and end date — as
the keyboard-accessible editing surface. Per WCAG 2.5.7 and the
Syncfusion/Telerik accessibility research cited in the spec, editing
is never arrow-key-drag-only: pointer drag-to-resize/reschedule is
supplementary to the composed date-time-picker edit path. Also ships
row hierarchy with derived parent date ranges and collapse/expand,
milestones, percent-complete as a data value, a today-column data
flag, and finish-to-start dependency data exposed via
`aria-describedby` (never a rendered arrow — every accessibility
source consulted treats the arrow itself as unsolved industry-wide).
Dependency-arrow rendering, virtualization, critical-path calculation,
dependency types beyond finish-to-start, interactive zoom switching,
weekend/holiday shading, and resource/assignee columns are documented
v1 non-goals, not gaps — see spec/index.md §9.

`GanttTableTD`'s own `active` prop is documented for "this cell is
within the task's span," but its implementation ties `active` to
roving `tabindex`/`aria-selected` — reusing it for span marking would
put multiple cells at `tabindex="0"` at once whenever a task's bar
spans more than one column. `active` here means exactly what it means
in `data-grid` and `kanban-board` (the roving-tabindex cursor); span
membership is a separate `data-in-range` attribute instead. See
spec/index.md §3.

---

Lily™ and Lily Design System™ are trademarks.
