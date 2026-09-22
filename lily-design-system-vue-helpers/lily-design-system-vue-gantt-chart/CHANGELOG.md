# Changelog — GanttChart (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/CHANGELOG.md)
(2026-09-22). Composes `@lilydesignsystem/vue-headless`'s `GanttTable`
family (structural, task bars as column-spanning cells rather than
pixel-positioned floating divs) and `@lilydesignsystem/vue-date-time-picker`
— used twice per edit session, for a task's start and end date —
mirroring `vue-picker-bar`'s established pattern for a Vue helper
composing a sibling helper package. Per WCAG 2.5.7, editing is never
arrow-key-drag-only: pointer drag-to-resize/reschedule is
supplementary to the composed date-time-picker edit path. Also ships
row hierarchy with derived parent date ranges and collapse/expand,
milestones, percent-complete as a data value, a today-column data
flag, and finish-to-start dependency data exposed via
`aria-describedby` (never a rendered arrow). Dependency-arrow
rendering, virtualization, critical-path calculation, dependency types
beyond finish-to-start, interactive zoom switching, weekend/holiday
shading, and resource/assignee columns are documented v1 non-goals —
see spec/index.md §9.

**Confirmed finding, matching the Svelte canonical's own:** Vue's
`GanttTableTD` doc comment claims its `active` prop indicates "the
task spans this time period," but the component's actual template
ties `active` to `aria-selected`/roving `tabindex` — the identical
contract overload the Svelte canonical's own `GanttTableTD` has.
Reusing `active` for span-membership would put multiple cells at
`tabindex="0"` at once whenever a task's bar spans more than one
column. This port makes the same resolution: `active` means only the
roving-tabindex cursor; span membership is a separate `data-in-range`
attribute; `GanttTableTD` is not modified. See spec/index.md §3.

The Svelte canonical's `onTaskChange` callback prop is this port's
`task-change` emitted event. `generateColumns` reuses
`date-time-picker`'s own UTC-safe `addDays` (rather than re-deriving
local-midnight-unsafe date math) via an explicit `addDaysFn` parameter,
and `index.ts` re-exports that `addDays` for public-surface parity with
the Svelte canonical's locally-defined one. Needs its own `shims.d.ts`
ambient module declarations for both
`@lilydesignsystem/vue-headless` and
`@lilydesignsystem/vue-date-time-picker`, for `vue-tsc`'s separate
declaration pass — the same convention `vue-picker-bar` already
established for a package composing more than one sibling dependency.

---

Lily™ and Lily Design System™ are trademarks.
