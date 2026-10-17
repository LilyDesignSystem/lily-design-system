# GanttChart — Specification (Vue helper)

Canonical contract: [the Svelte package's spec/index.md](../../lily-design-system-svelte-gantt-chart/spec/index.md)
(implemented first, 2026-09-22). This port mirrors its § numbering;
where the two disagree, the Svelte side wins. Differences here are
Vue-API-surface translations (props → `defineProps`/`emit` events) or
Vue-specific pure-function signature adjustments (§3), never behaviour
changes.

## 1. Purpose

A headless control that renders a set of tasks against a time axis as
an interactive Gantt chart: task bars as column-spanning grid cells
(never pixel-positioned floating divs), keyboard-accessible date/
duration editing composed from `vue-date-time-picker` (never arrow-key
drag as the only path), row hierarchy, milestones, percent-complete,
a today marker, and dependency data exposed as text. The component
owns state and behaviour; it does not own the grid's base markup.

## 2. Scope

Same as the Svelte canonical §2. In scope: rendering `tasks` against a
`range`/`timeUnit` time axis as a rectangular grid, pointer
drag-to-resize/reschedule, a keyboard-accessible edit surface built
from two composed `DateTimePicker` instances (start, end), row
hierarchy with collapse/expand and derived parent date ranges,
milestones (zero-duration tasks), percent-complete as a data value, a
today-column data flag, finish-to-start dependency data exposed via
`aria-describedby`, APG grid roving-tabindex keyboard navigation, and
`aria-live` change announcements.

Out of scope (v1 non-goals — see §9): dependency-arrow rendering,
virtualization, critical-path calculation, dependency types beyond
finish-to-start, interactive zoom-level switching, weekend/holiday
shading, resource/assignee columns.

## 3. Composition

`GanttChart` depends on `@lilydesignsystem/vue-headless`'s
`GanttTable`, `GanttTableThead`, `GanttTableTbody`, `GanttTableTr`,
`GanttTableTH`, `GanttTableTD` as a real npm dependency and renders
them unmodified. It also depends on `@lilydesignsystem/vue-date-time-picker`
— composed twice per edit session (once for a task's start date, once
for its end) — mirroring `lily-design-system-vue-picker-bar`'s own
precedent for a Vue helper composing sibling *helper* packages rather
than only headless components.

**`GanttTableTD`'s `active` prop, checked against the same overload
finding the Svelte canonical documents.** Vue's own `GanttTableTD.vue`
doc comment reads: "Supports an active state to indicate the task
spans this time period, communicated via `aria-selected`" — but its
actual template implementation is `:aria-selected="active ||
undefined"` and `:tabindex="active ? 0 : -1"` (until 2026-10-10, when `active` stopped setting
`aria-selected`; it still sets the roving `tabindex`, so the overload
reasoning below stands), i.e. `active` is tied
directly to the roving-tabindex cursor, exactly the same overload the
Svelte canonical's `GanttTableTD` has (see its own spec §3 and
CHANGELOG.md). Reusing `active` for "this cell is within the task's
span" would put multiple cells at `tabindex="0"` simultaneously
whenever a task's bar spans more than one column — a real
accessibility regression. This port therefore makes the identical
choice the Svelte canonical made: `active` means only the
roving-tabindex cursor, span-membership is the separate `data-in-range`
attribute, and `GanttTableTD` itself is not modified.

`generateColumns` reuses `@lilydesignsystem/vue-date-time-picker`'s own
`addDays` (already UTC-epoch-day-safe) rather than re-deriving it, so
it takes an explicit `addDaysFn` parameter instead of closing over a
module-local `addDays` the way the Svelte canonical's `<script
module>` block does — the cleanest way to share that dependency
between `GanttChart.vue`'s top `<script lang="ts">` pure-function block
and its `<script setup lang="ts">` block without relying on
cross-block import visibility. `compareISO`, `endOfMonth`,
`flattenTasks`, and `effectiveRange` have no equivalent in
`date-time-picker` and are ported here directly from the Svelte
canonical, translated to plain TS.

## 4. HTML

```html
<div class="gantt-chart {class}">
  <GanttTable :label="label" :caption="caption" @keydown="onGridKeydown">
    <GanttTableThead>
      <GanttTableTr>
        <GanttTableTH scope="col"></GanttTableTH>                 <!-- leading task-label column -->
        <GanttTableTH scope="col" data-today>{{ columnLabel(period) }}</GanttTableTH>
      </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
      <GanttTableTr>
        <GanttTableTH scope="row">
          <button class="gantt-chart-collapse-button" aria-expanded>…</button>  <!-- only on parent rows -->
          {{ taskLabel(task) }}
        </GanttTableTH>
        <GanttTableTD data-in-range data-milestone data-today aria-describedby="{dependencySummaryId}">
          <span class="gantt-chart-bar" data-percent-complete="{n}"></span>     <!-- only in the task's own leading in-range cell -->
        </GanttTableTD>
      </GanttTableTr>
      <tr class="gantt-chart-edit-row">                            <!-- only while a task is being edited -->
        <td :colspan="columns.length + 1">
          <DateTimePicker :label="labels.startLabel" mode="date" v-model:value="editStart" />
          <DateTimePicker :label="labels.endLabel" mode="date" v-model:value="editEnd" />
          <button class="gantt-chart-save-button">{{ labels.saveLabel }}</button>
          <button class="gantt-chart-cancel-button">{{ labels.cancelLabel }}</button>
        </td>
      </tr>
    </GanttTableTbody>
  </GanttTable>
  <p class="gantt-chart-status" aria-live="polite"></p>
</div>
```

## 5. Props and events

| Prop       | Type                                         | Required | Default |
| ---------- | ----------------------------------------------- | -------- | ------- |
| `label`    | `string`                                          | yes      | —       |
| `range`    | `{ start: string; end: string }` (ISO dates)      | yes      | —       |
| `tasks`    | `GanttTask[]`                                     | yes      | —       |
| `caption`  | `string`                                           | no       | —       |
| `timeUnit` | `"day" \| "week" \| "month"`                       | no       | `"day"` |
| `today`    | `string` (ISO date)                                | no       | — (no marker unless supplied) |
| `taskLabel`| `(task: GanttTask) => string`                      | no       | `task.label` |
| `labels`   | `GanttLabels`                                      | no       | `{}`    |
| `class`    | `string`                                           | no       | `""`    |

| Event         | Payload                                          | Fires |
| --------------- | --------------------------------------------------- | ------- |
| `task-change`   | `(taskId: string, start: string, end: string)`      | After a task's start/end changes, by pointer or by the edit region. |

Vue separates props from events by design: the Svelte canonical's
`onTaskChange` callback prop is this port's `task-change` emit,
matching `kanban-board`'s own `onMove` → `move` translation.

`GanttTask`: `id` (required), `label` (required), `start`/`end` (ISO
dates, required, inclusive; equal values mean a milestone),
`percentComplete?: number`, `parentId?: string`, `dependsOn?: string[]`.

`GanttLabels` — every field optional, but presence gates the control
it names: `columnLabel(start, end, timeUnit)`, `editButton(task)`,
`startLabel`/`endLabel` (passed as each composed `DateTimePicker`'s
own `label`), `dateTimePickerLabels` (a `DateTimePickerLabels` object,
reused for both composed pickers — editing is gated on this being
present), `saveLabel`/`cancelLabel`, `dependencySummary(predecessorLabels)`,
`dateAnnouncement(taskLabel, start, end)`, `collapseButton(task, collapsed)`.

## 6. Behaviour

Identical to the Svelte canonical §6:

**Time axis.** `range`/`timeUnit` generate a fixed set of columns
using epoch-day/UTC arithmetic — never local-midnight `Date`
construction.

**Task bars.** A task's `[start, end]` range is tested for overlap
against every column; overlapping cells carry `data-in-range`. A
milestone (`start === end`) marks its one cell `data-milestone`
instead of a spanning range. `percentComplete` rides as
`data-percent-complete` on the task's own leading in-range cell.

**Row hierarchy.** `task.parentId` builds a tree, flattened for
rendering with a `depth` used for indentation. A parent row's
`start`/`end` are derived (min start / max end across its descendants)
and rendered read-only. `GanttTableTH`'s own collapse button toggles a
parent's children; collapsing removes descendant rows from the DOM
outright.

**Dependencies.** `task.dependsOn` is data, not a rendered arrow: the
dependent task's cell carries `aria-describedby` pointing at a
generated, visually-hidden text node built from
`labels.dependencySummary`.

**Date/duration edit — keyboard.** Enter/Space on a focused
(non-parent) row opens an inline edit region for that task with two
composed `DateTimePicker` instances (`mode="date"`) bound to local
copies of `start`/`end`; Save emits `task-change` and closes; Cancel
discards. Gated on `labels.dateTimePickerLabels` being supplied — both
the function that opens the region AND the template block that renders
it check this, independently (defense in depth — see §3's discussion
of double-gating in `KanbanBoard`'s AGENTS.md for the analogous
pattern).

**Date/duration edit — pointer.** Native HTML5 drag-and-drop resizes
or reschedules a task's bar; supplementary, never the only path.

**Announcements.** A single `gantt-chart-status` `aria-live="polite"`
region announces successful edits via `labels.dateAnnouncement`.

**SSR.** All DOM writes inside Vue's mount lifecycle; `today` is never
computed internally.

## 7. Accessibility

Same as the Svelte canonical §7: WAI-ARIA APG Grid pattern
(`role="grid"`, inherited from `GanttTable`). Roving-tabindex focus
management for body cells — see §3 for why `active` is scoped to the
cursor only, not doubled as the task-span marker. Row-header cells
(`GanttTableTH`, `scope="row"`) hold each task's label and, for
parents, the collapse button; they sit outside the roving-tabindex
column index.

## 8. Acceptance criteria

Same clauses as the Svelte canonical, restated for the Vue surface:

- §8.1 Renders `<div class="gantt-chart">` wrapping a `GanttTable`
  whose `role="grid"` and `aria-label` come from `label`.
- §8.2 Generates one column per day/week/month across `range`
  according to `timeUnit`, using UTC/epoch-day arithmetic.
- §8.3 A task's `[start, end]` marks every overlapping column's cell
  with `data-in-range`; a milestone (`start === end`) marks exactly
  one cell `data-milestone` instead.
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
  keys move it and clamp at the grid's edges within the current row/
  column axis rather than wrapping.
- §8.9 Enter/Space on a focused non-parent row opens an inline edit
  region with two composed `DateTimePicker` instances seeded from that
  task's current `start`/`end`, only when `labels.dateTimePickerLabels`
  is supplied; a parent row does not open one.
- §8.10 Saving the edit region emits `task-change` with the task's id
  and the edited `start`/`end`, then closes the region.
- §8.11 Cancelling the edit region discards changes without emitting
  `task-change`.
- §8.12 A pointer drag-resize/reschedule of a task's bar emits
  `task-change` the same way the keyboard path does.
- §8.13 A successful edit (by either path) writes an announcement to
  `gantt-chart-status` (`aria-live="polite"`) built from
  `labels.dateAnnouncement`; no announcement fires when that label is
  absent.
- §8.14 `today`, when supplied, marks its column `data-today`; when
  omitted, no column carries it.
- §8.15 Extra attributes spread onto the root `<div>` (Vue's default
  single-root `inheritAttrs`).
- §8.16 No hardcoded user-facing strings: every label comes from a
  prop or a `labels.*` function.

**Added 2026-10-11** (canonical §8.6–§8.11, §8.16, §8.17; see the Svelte package's spec):

- Row depth is `data-depth` on the row header, never an inline style.
- A task whose `parentId` names no task renders as a top-level row; a
  `parentId` cycle does not hang; parent ranges are derived in one pass.
- Focusing a cell by pointer moves the roving cursor there; when collapsing
  removes the row under the cursor, exactly one cell stays tabbable.
- Opening the edit region moves focus to the start date's field; Save
  (disabled while a date is empty) saves a range entered end-first
  start-first; Save, Cancel and Escape return focus to the grid.
- Without their labels, the collapse button and the edit region do not
  render unnamed; `labels.taskColumnHeader` names the leading header cell.

## 9. Non-goals

Same as the Svelte canonical §9: dependency-arrow rendering,
virtualization, critical-path calculation, dependency types beyond
finish-to-start, interactive zoom-level switching, weekend/holiday
shading, resource/assignee columns.

## 10. Relationship to the headless layer and other helpers

`GanttChart` composes three different dependencies in one package: the
structural `GanttTable` family (matching `data-grid`'s relationship to
`DataTable`), and `vue-date-time-picker` used twice per edit session —
mirroring `vue-picker-bar`'s established dependency/build-alias pattern
for a same-catalog cross-package dependency (see this package's own
`shims.d.ts` and the workspace `vite.config.js`/`vite.lib.config.ts`
entries it needed). Follows every other Vue helper's established
rules: headless (no bundled CSS), SSR-safe, i18n-clean (label-presence
gates each control), `<script setup lang="ts">` Composition API.

## Svelte 0.2.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§12 there): `readonly`, `markers` (`data-marker` plus a text label), `isNonWorking` (`data-non-working` when every day in a column is non-working), and task `type`/`critical`/`slack` as `data-*` hooks on the row.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there): the progress field (`labels.percentLabel`, a 4th `onTaskChange` argument), baselines (`task.baseline`, `data-baseline`, `labels.baselineSummary`) and typed dependencies (`dependsOn` objects, `labels.dependencyDetail`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §14.1–§14.17): zoom (`timeUnit`, `labels.zoomIn` / `zoomOut`), drag-resize handles, task selection (`selectedTaskId`, `onTaskSelect`, the `s` key), Alt+ArrowLeft/Right shift and Alt+Shift+Arrow end move, and `taskAttrs`.

## Unscheduled tasks and collapse-all (2026-10-16)

Ported from the Svelte canonical (its spec "Unscheduled tasks and collapse-all", tests §14.18–§14.24). `start` / `end` are optional on a task: with neither, the row renders no bar and no `data-in-range` cells and carries `data-unscheduled`; the edit region opens with empty dates and Save is disabled until both are set. `effectiveRanges` skips an unscheduled child when deriving a parent's span (a parent whose children are all unscheduled has an empty range and is unscheduled itself). Drag, resize and Alt+Arrow ignore an unscheduled task, and a baseline variance with no current end is 0. `collapsedTaskIds` holds the collapsed parent ids; `labels.expandAll` / `labels.collapseAll` gate two buttons in `.gantt-chart-collapse-all` (shown only when the chart has parents), each disabled when it would change nothing.

## 11. Typed fields, inline editing, export, virtualization (0.5.0, 2026-10-16)

Tests §14.25–§14.40. The data grid's cell types, export and windowing, applied to tasks.

- **Typed fields**: `fields` is a list of `{ id, header, type?, options?, numberFormat?, dateFormat?, parse?, exportValue?, exportable?, editable?, editLabel? }`, read from `task.values[id]`.
  Each is a column (`th scope="col"` plus a `GanttTableTD` per row, `data-field`, `data-type`) between the task name and the timeline. `type` is a data-grid cell type; `resolveColumn` fills in the
  type's `format`, `compare` and `exportValue`, once per `fields` / `locale` change. With no `locale` a value shows as stored. The field cells carry no `data-row` / `data-col`, so the roving timeline grid is unchanged.
- **Inline editing**: `field-edit` `({ taskId, fieldId, value, previous })` turns it on (and not `readonly`, not `editable: false`). `text`, `number`, `link`, `date`, `time`, `select` and `radio` fields edit; the others
  display and export only. The value becomes a `.gantt-chart-field-button` (`tabindex="-1"`, named by the header plus the value); clicking it, or **F2** on a timeline cell (first editable field of the row), opens
  `.gantt-chart-field-editor` (an `<input>` of the type, or a `<select>` of `options`). **Enter** commits, **Escape** cancels, blur commits, **Tab** / **Shift+Tab** commit and move to the row's next / previous editable field.
  The editor owns its keys, and while an IME is composing (`isComposing`, or `keyCode` 229) Enter, Escape and Tab belong to the IME. A value that does not fit the type is refused (the editor stays open,
  `labels.editInvalid`); an unchanged value reports nothing; `labels.editAnnouncement(task, header, text)`. Parent tasks' fields are their own data and edit like any other.
- **Export**: `labels.exportCsv` / `exportTsv` / `exportExcel` each gate a `.gantt-chart-export-button` (`data-gantt-export-format`) in a `.gantt-chart-export` group named by `labels.export`; none renders without
  `labels.exportHeaders`. One row per task in tree order: task label, start, end (a parent's derived span; real dates in Excel, empty for an unscheduled task), then — each only when its header is named — percent
  complete, parent label, predecessors (`; ` joined), baseline start and end; then every `exportable` field. `exportScope` `"all"` (default) or `"visible"` (leaves out tasks under a collapsed parent).
  Formula-looking text is defused. `exportHandler` / `export-file` `({ format, filename, taskCount, blob })` may return `false` to take over; otherwise the file is saved and `labels.exportAnnouncement` is announced.
- **Virtualization**: `virtualize: { rowHeight, height, overscan = 3 }` puts the table in a `.gantt-chart-scroll` area (`height` px, `overflow: auto`, the structural inline style) and renders only the rows in view plus the
  roving tab stop's row, between `.gantt-chart-spacer` rows. Rows carry `aria-rowindex`, the table `aria-rowcount`; keyboard focus scrolls the target row in. Rows are assumed `rowHeight` px tall.
- **Hot path**: a task lookup map, per-column marker and today flags built once per `markers` / `columns` / `today` change, so a render does no per-cell `filter` or `find`.

## 17. Weekend shading and dependency arrows (0.6.0, 2026-10-17)

Tests §17.1–§17.10.

- **Weekend shading**: `weekends` is a list of weekdays (0 = Sunday … 6 = Saturday), for example `[0, 6]` or `[5, 6]`. A **day** column whose date falls on one gets `data-weekend` on its header and on every body cell
  (week and month columns are never marked: a column is not a day). It is never defaulted — the weekend is the consumer's locale — and it combines with `isNonWorking` (a holiday on a weekday is `data-non-working`;
  both attributes can sit on one cell). The weekday is computed from the epoch day (`weekdayOfEpochDay`), never from the browser's time zone. Shading is CSS: the 57 `themes/` tint `[data-weekend]` cells.
- **Dependency arrows**: `dependencyArrows` draws one `<path class="gantt-chart-dependency-arrow" data-from data-to data-dependency-type>` per dependency in an `<svg class="gantt-chart-dependency-arrows" aria-hidden="true">`
  laid over the scroll area (`position:absolute; pointer-events:none` — the structural inline style; the scroll area becomes `position:relative`). Edges follow the type: `e2s` predecessor end → dependent start, `s2s`,
  `s2e`, `e2e` likewise. The path is orthogonal and always arrives horizontally, with an arrowhead marker; when the dependent starts too close to the predecessor's end it goes round through the row gap
  (`dependencyPath`, a pure, unit-tested function in `dependency-arrows.ts`). Positions are **measured** from the rendered cells (first and last `td[data-in-range]` of each row), after render and whenever the
  table's size changes, so it is client-only and SSR-safe (no overlay until measured). Arrows are drawn only between rows that exist in the DOM: a collapsed parent's children and a virtualized chart's off-screen
  rows have none. The overlay is decoration: dependencies remain available as text through `labels.dependencySummary` / `dependencyDetail`, and arrows take no focus. Stroke and colour are CSS (`currentColor`).
  Lag is not drawn (no pixel-positioned bars); critical-path highlighting is still `task.critical`.

