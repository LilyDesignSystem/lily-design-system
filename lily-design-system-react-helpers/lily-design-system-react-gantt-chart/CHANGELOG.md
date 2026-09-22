# Changelog — GanttChart (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/)
(see [spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md)),
translated to React 19 idioms (hooks instead of runes, controlled
`value`/`onChange` instead of two-way binding). Composes
`@lilydesignsystem/react-headless`'s `GanttTable` family (structural,
task bars as column-spanning cells rather than pixel-positioned
floating divs, unmodified) and `@lilydesignsystem/react-date-time-picker`
— used twice per edit session, for a task's start and end date — as
the keyboard-accessible editing surface, mirroring
`@lilydesignsystem/react-picker-bar`'s own cross-package dependency/
build-alias pattern for depending on a sibling helper in a catalog
with no pnpm workspace linking. Per WCAG 2.5.7, editing is never
arrow-key-drag-only: pointer drag-to-resize/reschedule is
supplementary to the composed date-time-picker edit path. Also ships
row hierarchy with derived parent date ranges and collapse/expand,
milestones, percent-complete as a data value, a today-column data
flag, and finish-to-start dependency data exposed via
`aria-describedby` (never a rendered arrow — documented non-goal).
Dependency-arrow rendering, virtualization, critical-path calculation,
dependency types beyond finish-to-start, interactive zoom switching,
weekend/holiday shading, and resource/assignee columns are documented
v1 non-goals, not gaps — see spec/index.md §9.

Confirmed this catalog's `GanttTableTD` has the identical `active`-prop
documentation/implementation overload the Svelte reference found
(`lily-design-system-react-headless/components/GanttTableTD.tsx`: doc
comment says "active time period for the task," implementation ties
`active` to roving `tabindex`/`aria-selected`). Resolved the same way:
`active` here means exactly what it means in `react-kanban-board` (the
roving-tabindex cursor); span membership is a separate `data-in-range`
attribute instead. `GanttTableTD` itself is not modified. See
spec/index.md §3.

Workspace changes needed to compose a sibling helper: `vite.config.ts`
gained a `resolve.alias` entry for
`@lilydesignsystem/react-date-time-picker` (local dev/test only) and
`tsconfig.json` gained a matching `paths` entry (for this package's own
`--dts` build to resolve the sibling's type declarations). `build.js`
needed no change — it already externalizes every discovered sibling
package by name, and `…-date-time-picker` already sorts before
`…-gantt-chart` alphabetically, so no `picker-bar`-style manual sort
exception was needed.

---

Lily™ and Lily Design System™ are trademarks.
