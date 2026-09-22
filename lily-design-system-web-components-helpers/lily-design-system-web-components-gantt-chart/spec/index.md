# GanttChart — Specification (Web Components helper)

Canonical contract for `@lilydesignsystem/web-components-gantt-chart`,
registered as `<lily-gantt-chart>`. Ports
[`@lilydesignsystem/svelte-gantt-chart`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/spec/index.md)
(proposed 2026-09-21) to this catalog's vanilla-custom-element idiom.
Svelte wins on behaviour; this package supplies the custom-element API
shape. Ported 2026-09-22.

## 1. Purpose

A headless control that renders a set of tasks against a time axis as
an interactive Gantt chart: task bars as column-spanning grid cells
(never pixel-positioned floating divs), keyboard-accessible date/
duration editing composed from `date-time-picker` (never arrow-key
drag as the only path), row hierarchy, milestones, percent-complete,
a today marker, and dependency data exposed as text. The component
owns state and behaviour; it does not own the grid's base markup.

## 2. Scope

In scope: rendering `tasks` against a `range`/`timeUnit` time axis as
a rectangular grid, pointer drag-to-reschedule, a keyboard-accessible
edit surface built from two composed `<lily-date-time-picker>`
instances (start, end), row hierarchy with collapse/expand and derived
parent date ranges, milestones (zero-duration tasks), percent-complete
as a data value, a today-column data flag, finish-to-start dependency
data exposed via `aria-describedby`, APG grid roving-tabindex keyboard
navigation, and `aria-live` change announcements.

Out of scope (v1 non-goals — see §9): dependency-arrow rendering,
virtualization, critical-path calculation, dependency types beyond
finish-to-start, interactive zoom-level switching, weekend/holiday
shading, resource/assignee columns. Same reasoning as the Svelte
reference — see
[spec/helpers/index.md § gantt-chart contract](../../../spec/helpers/index.md).

## 3. Composition

`<lily-gantt-chart>` depends on
`@lilydesignsystem/web-components-headless`'s `<lily-gantt-table>` as a
real npm dependency and renders it unmodified, and on the sibling
helper `@lilydesignsystem/web-components-date-time-picker`, composed
TWICE per edit session (task start, task end) — this catalog's first
helper-to-helper composition, mirroring `picker-bar.ts`'s established
bare-side-effect-import pattern for a sibling *helper* dependency
(`import "@lilydesignsystem/web-components-date-time-picker";`, plus
`import type {...}` for types).

As with `kanban-board`, `<lily-gantt-table>` has no `GanttTableTD`
sub-element family in this catalog — the consumer supplies
`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` as plain light-DOM children,
built with `document.createElement`/`appendChild` (never `innerHTML` —
see `<lily-gantt-table>`'s own doc comment on the HTML5 table-parsing
gotcha). Unlike `<lily-kanban-table>`, `<lily-gantt-table>` already
defaults its inner `<table>` to `role="grid"`, so no explicit override
is needed here.

This component owns its own `<td>` cells directly (class
`gantt-chart-td`), so — matching the Svelte reference's own reasoning
in its §3 — the roving-tabindex cursor (`tabindex`/`aria-selected`) and
"this cell falls within the task's span" (`data-in-range`) are two
independent attributes on the same cell, never conflated: a task's bar
can cover many cells at once, while roving-tabindex requires exactly
one `tabindex="0"` cell grid-wide.

**Civil-date arithmetic is reused, not re-derived.** Rather than
re-implementing UTC/epoch-day-safe date math (as the Svelte reference
does, since it has no sibling package to draw on), this package
imports `addDays`, `parseIsoDate`, `formatIsoDate`, `daysInMonth`, and
`toEpochDay` directly from
`@lilydesignsystem/web-components-date-time-picker` — that package
already carries the same UTC/epoch-day discipline for its own calendar
math, so a second implementation here would only be a
divergence risk. Only `compareISO` (an ordinary string comparison —
zero-padded ISO dates sort correctly as strings) and `endOfMonth`
(composed from the imported primitives) are defined locally, matching
the Svelte reference's exported surface for these two.

## 4. HTML

```html
<lily-gantt-chart label="…" caption="…"></lily-gantt-chart>
```

renders:

```html
<div class="gantt-chart {class}">
  <lily-gantt-table label="{label}">
    <table class="gantt-table" role="grid" aria-label="{label}">
      <caption>{caption}</caption> <!-- only when caption is set -->
      <thead>
        <tr>
          <th class="gantt-chart-th" scope="col"></th> <!-- leading task-label column -->
          <th class="gantt-chart-th" scope="col" data-today>{columnLabel(start,end,timeUnit) ?? start}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="gantt-chart-row-header" scope="row" style="padding-inline-start: {depth}em">
            <button class="gantt-chart-collapse-button" aria-expanded aria-label="{labels.collapseButton(task,collapsed)}">▾</button> <!-- only on parent rows -->
            {taskLabel(task)}
            <span class="gantt-chart-dependency-summary" id="{dependencyId}" hidden>{labels.dependencySummary(preds)}</span> <!-- only when deps exist and the label is set -->
          </th>
          <td class="gantt-chart-td" role="gridcell" data-row data-col tabindex aria-selected data-in-range data-milestone data-today aria-describedby="{dependencyId}">
            <span class="gantt-chart-bar" data-percent-complete="{n}" draggable="true"></span> <!-- only in the task's own leading in-range cell -->
          </td>
        </tr>
        <tr class="gantt-chart-edit-row"> <!-- only while this row's task is being edited; inserted/removed, not hidden -->
          <td colspan="{columns.length + 1}">
            <lily-date-time-picker label="{labels.startLabel}" mode="date" value="{editStart}"></lily-date-time-picker>
            <lily-date-time-picker label="{labels.endLabel}" mode="date" value="{editEnd}"></lily-date-time-picker>
            <button class="gantt-chart-save-button">{labels.saveLabel}</button>
            <button class="gantt-chart-cancel-button">{labels.cancelLabel}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </lily-gantt-table>
  <p class="gantt-chart-status" aria-live="polite"></p>
</div>
```

**Deviation from the Svelte/kanban-board shape:** the edit row is
inserted/removed via `insertAdjacentElement`/`remove()` (a targeted DOM
mutation, matching the Svelte reference's own `{#if editingTaskId ===
row.task.id}` mount/unmount) rather than "always rendered, toggled via
`hidden`" the way kanban-board's per-card move menu is. A composed
`<lily-date-time-picker>` is a heavy, stateful component (its own
calendar dialog, focus trap, etc.); building one per non-parent row
up front — most of which would sit hidden and unused — is real cost
kanban-board's cheap `<ul><li>` move menu does not have. Since only one
task can be under edit at a time, this is a single-element insert/
remove, not a full-grid rebuild.

## 5. Public surface

| Member | Kind | Type | Required | Default |
| --- | --- | --- | --- | --- |
| `label` | attribute + property | `string` | yes | — |
| `caption` | attribute + property | `string` | no | — |
| `today` | attribute + property | `string` (ISO date) | no | — (no marker unless supplied) |
| `time-unit` / `timeUnit` | attribute + property | `"day" \| "week" \| "month"` | no | `"day"` |
| `range` | property-only | `{ start: string; end: string }` | yes | `{start:"",end:""}` |
| `tasks` | property-only | `GanttTask[]` | yes | `[]` |
| `taskLabel` | property-only | `(task: GanttTask) => string` | no | `task.label` |
| `onTaskChange` | property-only | `(taskId, start, end) => void` | no | — |
| `labels` | property-only | `GanttLabels` | no | `{}` |
| `class` | attribute | `string` | no | `""` |

`GanttTask`: `id` (required), `label` (required), `start`/`end` (ISO
dates, required, inclusive; equal values mean a milestone),
`percentComplete?: number`, `parentId?: string`, `dependsOn?: string[]`
(other tasks' ids, finish-to-start).

`GanttLabels` — every field optional, presence gates the control it
names: `columnLabel(start, end, timeUnit)`, `startLabel`/`endLabel`
(each composed `<lily-date-time-picker>`'s own `label`),
`dateTimePickerLabels` (a `DateTimePickerLabels` object, reused for
both composed pickers — **editing itself is gated on this being
present**, since `date-time-picker` requires it too),
`saveLabel`/`cancelLabel`, `dependencySummary(predecessorLabels)`,
`dateAnnouncement(taskLabel, start, end)`, `collapseButton(task,
collapsed)`. `editButton`/`editDialogLabel` are accepted for parity
with the Svelte reference's own `GanttLabels` type but — mirroring
that reference exactly — are not wired to any control: editing opens
from Enter/Space on the row, not a dedicated button.

## 6. Behaviour

**Time axis.** `range`/`time-unit` generate a fixed set of columns —
one per day, per 7-day week, or per calendar month — using
UTC/epoch-day arithmetic (see §3) so no column boundary can land on
the wrong day across a DST transition. `time-unit` is a static
rendering choice; an interactive zoom control is v2 (§9).

**Task bars.** A task's `[start, end]` range is tested for overlap
against every column; overlapping cells carry `data-in-range`. A
milestone (`start === end`) marks its one cell `data-milestone`
instead of a spanning range. `percentComplete`, when set, rides as
`data-percent-complete` on the task's own leading in-range cell.

**Row hierarchy.** `task.parentId` builds a tree, flattened for
rendering with a `depth` used for indentation
(`padding-inline-start`). A parent row's `start`/`end` are derived
(min start / max end across its descendants) and rendered read-only —
parent rows are not directly editable. The row header's own collapse
button toggles a parent's children; collapsing removes descendant rows
from the DOM outright (a full structural re-render, since which rows
exist at all has changed).

**Dependencies.** `task.dependsOn` is data, not a rendered arrow: the
dependent task's data cells carry `aria-describedby` pointing at a
generated, visually-hidden text node built from
`labels.dependencySummary`. No dependency line is drawn — see §9.

**Date/duration edit — keyboard.** Enter/Space on a focused
(non-parent) row opens an inline edit region for that task with two
composed `<lily-date-time-picker>` instances (`mode="date"`) seeded
from that task's current `start`/`end`; Save calls `onTaskChange` and
closes; Cancel discards. Gated on `labels.dateTimePickerLabels` being
supplied.

**Date/duration edit — pointer.** Native HTML5 drag-and-drop
reschedules a task's bar, preserving its duration; supplementary,
never the only path.

**Announcements.** A single `gantt-chart-status` `aria-live="polite"`
region announces successful edits via `labels.dateAnnouncement`.

**Keyboard — grid.** Same WAI-ARIA APG Grid roving-tabindex model as
`kanban-board`, transposed: rows are tasks, columns are time periods.
`Home`/`End` move within the current ROW (not column — the axes are
swapped relative to `kanban-board`); `Ctrl+Home`/`Ctrl+End` jump to the
grid's first/last cell.

**SSR.** All DOM writes happen in `connectedCallback`/property
setters, guarded by `this.isConnected`. `today` is never computed
internally — a server-computed "today" and a client-computed one can
disagree across a render boundary — no marker renders unless the
consumer supplies it.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, `<lily-gantt-table>`'s own
default — no override needed, unlike `kanban-board`). Roving-tabindex
focus management for data cells only — row-header cells sit outside
the roving-tabindex column index, holding each task's label and, for
parents, the collapse button. Editing via composed
`<lily-date-time-picker>` is the accessible path for rescheduling;
drag is supplementary, never required. One `aria-live="polite"` region
for all edit announcements.

## 8. Acceptance criteria

- §8.1 Renders `<div class="gantt-chart">` wrapping a
  `<lily-gantt-table>` whose inner `<table role="grid">` carries
  `aria-label` from `label`.
- §8.2 Generates one column per day/week/month across `range`
  according to `time-unit`, using UTC/epoch-day arithmetic.
- §8.3 A task's `[start, end]` marks every overlapping column's cell
  `data-in-range`; a milestone (`start === end`) marks exactly one
  cell `data-milestone` instead.
- §8.4 `percentComplete` renders as `data-percent-complete` on the
  task's leading in-range cell only when set.
- §8.5 A task with `parentId` renders nested under its parent with a
  `depth`-based indentation; the parent's own `start`/`end` are
  derived (min/max of its descendants), not its own data.
- §8.6 A parent row's collapse button toggles `aria-expanded` and
  removes/restores descendant rows from the DOM outright.
- §8.7 A task's `dependsOn` produces an `aria-describedby` reference
  to a generated summary built from `labels.dependencySummary`; a
  task with no dependencies carries neither.
- §8.8 Exactly one body cell carries `tabindex="0"` at any time; arrow
  keys move it and clamp at the grid's edges rather than wrapping.
- §8.9 Enter/Space on a focused non-parent row opens an inline edit
  region with two composed `<lily-date-time-picker>` instances seeded
  from that task's current `start`/`end`, only when
  `labels.dateTimePickerLabels` is supplied; a parent row does not
  open one.
- §8.10 Saving the edit region calls `onTaskChange` with the task's id
  and the edited `start`/`end`, then closes the region.
- §8.11 Cancelling the edit region discards changes without calling
  `onTaskChange`.
- §8.12 A pointer drag-reschedule of a task's bar calls `onTaskChange`
  the same way the keyboard path does, preserving duration.
- §8.13 A successful edit (by either path) writes an announcement to
  `gantt-chart-status` (`aria-live="polite"`) built from
  `labels.dateAnnouncement`; no announcement fires when that label is
  absent.
- §8.14 `today`, when supplied, marks its column `data-today`; when
  omitted, no column carries it.
- §8.15 Extra attributes set on the `<lily-gantt-chart>` host are
  copied onto the root `<div>`.
- §8.16 No hardcoded user-facing strings: every label comes from a
  property or a `labels.*` function; the one falls-back exception is
  a column header with no `labels.columnLabel` rendering its raw ISO
  date rather than nothing, matching the Svelte reference exactly.

## 9. Non-goals

Dependency-arrow rendering, virtualization, critical-path calculation,
dependency types beyond finish-to-start, interactive zoom-level
switching, weekend/holiday shading, resource/assignee columns. See §2
and
[spec/helpers/index.md § gantt-chart contract](../../../spec/helpers/index.md).

## 10. Relationship to the headless layer and other helpers

`GanttChart` composes three different dependencies in one package: the
structural `<lily-gantt-table>` (matching `kanban-board`'s relationship
to `<lily-kanban-table>`), and `<lily-date-time-picker>` used twice per
edit session — the first Web Components helper-to-helper composition
used for a single feature, mirroring `picker-bar.ts`'s dependency
pattern for a sibling helper (not headless). Follows every other
helper's established rules: headless (no bundled CSS), SSR-safe,
i18n-clean (label-presence gates each control).
