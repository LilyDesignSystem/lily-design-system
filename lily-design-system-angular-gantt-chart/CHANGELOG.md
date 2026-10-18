# Changelog — GanttChart (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

- Added `criticalPath()` and `applyCriticalPath()` (all four dependency kinds, lags and leads in calendar or working days), copied from `shared/critical-path.ts`. Ported from the Svelte package.
- Added `labels.criticalLabel`: visible text (`.gantt-chart-critical-label`) beside the label of a task with `critical: true`, so the state is not colour-only and the task label, which "depends on" text reuses, stays unchanged. Ported from the Svelte package.

## 0.7.0 — 2026-10-17

- Now composed from the headless layer: the search field is the headless `SearchInput` and a match is the headless `Mark` (the `search-input` / `mark` base classes join the existing `*-search` / `*-match` hooks, so the 57 themes style them too). Keyboard movement (arrows, Home/End, page keys, right-to-left) comes from the shared `grid-navigation` module.
- Added right-to-left arrow keys (`isRtl`, `logicalKey`).
- Added `unavailable` (holidays, time off, closures as dated ranges): `data-unavailable` / `data-partly-unavailable` on columns and cells, label text in the header, theme shading and stripes.
- Added field `validate` (with `aria-invalid` and `labels.editRefused`) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through the `fieldEdit` output.
- Added PageUp / PageDown and type-ahead to the grid keyboard.
- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `copyHandler`; `toClipboardText`, `copyToClipboard`).
- Added `filter` and `compare` (sibling order).
- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. The Gantt chart and calendar gain search (new).
- Ported from the Svelte 0.7.0; the pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.6.0 — 2026-10-17

- Added weekend shading: `weekends` (weekdays, 0 = Sunday … 6 = Saturday; never defaulted) marks day columns `data-weekend` on the header and every cell. The 57 reference themes tint them.
- Added dependency arrows: `dependencyArrows` draws an `aria-hidden` SVG arrow per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description remains.
- Exports `dependencyPath` and `weekdayOfEpochDay` (pure, tested).

## 0.5.0 — 2026-10-16

- Added typed task fields (`fields`, `task.values`, `locale`) as columns between the task name and the timeline, using the data grid's cell types.
- Added inline field editing (`fieldEdit` output, with `[editableFields]="true"`): click a value, F2, Tab to the next field; typed editors, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `exportHandler` / `exportFile`); dates are real dates in Excel.
- Added `virtualize` (windowed rows with spacers, `aria-rowcount` / `aria-rowindex`).
- Marker, today and task lookups are computed once per change instead of per cell.

## 0.4.0 — 2026-10-16

- Added unscheduled tasks, ported from the Svelte 0.4.0: a task with no `start` / `end` renders its row with no bar (`data-unscheduled`); Enter opens the edit region with empty dates and Save stays disabled until both are set, which schedules it through `onTaskChange`. An unscheduled child does not shape its parent's span; drag and Alt+Arrow do nothing for it.
- Added `[(collapsedTaskIds)]` and `labels.expandAll` / `labels.collapseAll` buttons that expand or collapse every parent task.

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

## 0.1.1 — 2026-10-01

**Fix: dependency range on `@lilydesignsystem/angular-headless` widened
from `^0.1.0` to `^0.2.0`.** This package's own headless imports (the `GanttTable*`
components) already exist in 0.1.0, but it embeds
`@lilydesignsystem/angular-date-time-picker`, whose 0.1.2 needs
angular-headless 0.2.0; widening here keeps a single headless copy in a
consumer's tree. No source change.

## 0.1.0 — 2026-09-22

Initial release. Ports `@lilydesignsystem/svelte-gantt-chart`
(2026-09-22) to Angular 20: composes
`@lilydesignsystem/angular-headless`'s `GanttTable` family (structural,
task bars as column-spanning cells rather than pixel-positioned
floating divs) and the **sibling helper**
`@lilydesignsystem/angular-date-time-picker` — used twice per edit
session, for a task's start and end date — as the keyboard-accessible
editing surface, mirroring `angular-picker-bar`'s own established
sibling-helper dependency/build-alias pattern (an
`allowedNonPeerDependencies` entry, a dev-only `vitest.config.ts`/
`tsconfig.json` alias to the sibling's built `dist/`). Per WCAG 2.5.7
and Syncfusion's own accessibility documentation (no keyboard shortcut
exists for dragging a Gantt bar), editing is never arrow-key-drag-only:
pointer drag-to-resize/reschedule is supplementary to the composed
date-time-picker edit path. Also ships row hierarchy with derived
parent date ranges and collapse/expand, milestones, percent-complete
as a data value, a today-column data flag, and finish-to-start
dependency data exposed via `aria-describedby` (never a rendered
arrow). Dependency-arrow rendering, virtualization, critical-path
calculation, dependency types beyond finish-to-start, interactive zoom
switching, weekend/holiday shading, and resource/assignee columns are
documented v1 non-goals, not gaps — see spec/index.md §9.

Civil-date arithmetic: `addDays`, `daysInMonth`, `formatIsoDate`,
`parseIsoDate`, and `toEpochDay` are **reused directly** from
`@lilydesignsystem/angular-date-time-picker` (the sibling helper this
package also composes for editing) rather than re-derived, per this
port's own instructions — confirmed exported from that package's own
`index.ts` before reuse. Only the pieces date-time-picker does not
already export — `compareISO`, `endOfMonth`, `generateColumns`,
`flattenTasks`, `effectiveRange` — are ported here from the Svelte
reference as plain TypeScript (`endOfMonth` itself is built on the
reused `daysInMonth`/`parseIsoDate`/`formatIsoDate` rather than
reimplementing month-length logic).

Two real deviations from the Svelte reference were found while reading
Angular's headless `GanttTable`/`GanttTableTD` source (as this port's
own instructions required):

- **`GanttTableTD`'s `active` prop.** The task instructions flagged
  this as the single riskiest area to check: Svelte's `GanttTableTD`
  documents `active` for "this cell is within the task's span" but
  actually *implements* it as the roving-tabindex cursor/`aria-selected`
  — a real contract overload the Svelte package's own spec §3 and
  CHANGELOG work around by keeping `active` scoped to the cursor only
  and marking span-membership with a separate `data-in-range`
  attribute instead. **Angular's `GanttTableTD` has no `active` prop at
  all** — confirmed by reading `GanttTableTD.ts` in full; it is a bare
  attribute-selector directive with only a `className` input. The
  overload risk therefore does not exist in this catalog's port: there
  is no prop to overload, so nothing needed working around. This
  package still marks the roving-tabindex cursor
  (`data-row`/`data-col`/`tabindex`/`aria-selected`) and span
  membership (`data-in-range`) as two independent attribute bindings
  on the native `<td lily-gantt-table-td>` cell, matching the Svelte
  contract's *chosen resolution* even though nothing forced it here —
  keeping the two concepts separate is good practice regardless of
  whether `GanttTableTD` happens to have a prop to overload.
- **`role="grid"`.** Angular's headless `GanttTable` sets no `role` at
  all on its rendered `<table>` (Svelte's does). Since `GanttTable` is
  on this port's "do not modify" list, `GanttChart` applies
  `role="grid"` itself, once, in `ngAfterViewInit()` — a plain DOM
  write outside Angular's own change-detection tracking, the same fix
  `kanban-board` needed for the identical gap in `KanbanTable`.
- **`caption`.** Angular's headless `GanttTable` also has no `caption`
  input; a projected `<caption>` element (valid as a `<table>`'s first
  child regardless) covers it, same as `kanban-board`.

No change was made to `GanttTable`, `GanttTableTD`, or any other
headless component in this package's port.

`onTaskChange` (a Svelte callback prop) becomes the `taskChange`
output, this catalog's established idiom.

**Build verification.** After `ng-packagr` built this package, its
FESM bundle's imports were inspected directly: both
`@lilydesignsystem/angular-headless` and
`@lilydesignsystem/angular-date-time-picker` remain external
(`import { ... } from "@lilydesignsystem/angular-..."`), never
inlined, and `dist/package.json`'s `dependencies` lists both — matching
the pattern already verified for `angular-picker-bar` and for the
Svelte catalog's own `data-grid`/`gantt-chart`.

---

Lily™ and Lily Design System™ are trademarks.
