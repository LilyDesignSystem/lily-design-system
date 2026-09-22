# Changelog — GanttChart (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Proposed and specced in
[spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md),
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
