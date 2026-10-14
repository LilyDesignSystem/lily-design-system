# Changelog — `<gantt-chart>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
