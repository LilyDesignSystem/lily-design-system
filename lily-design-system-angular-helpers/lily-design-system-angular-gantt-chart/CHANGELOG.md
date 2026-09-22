# Changelog — GanttChart (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
