# GanttChart — Specification (Angular helper)

Canonical contract for `@lilydesignsystem/angular-gantt-chart`. Ports
the contract proposed in
[spec/helpers/index.md § gantt-chart contract](../../../spec/helpers/index.md)
and first implemented in `svelte-helpers` as
`@lilydesignsystem/svelte-gantt-chart` (2026-09-22). This document
mirrors that package's `spec/index.md`, adapted where Angular's own API
surface and headless layer differ — see §3 and §10 for every deviation
found while porting.

## 1. Purpose

A headless control that renders a set of tasks against a time axis as
an interactive Gantt chart: task bars as column-spanning grid cells
(never pixel-positioned floating divs), keyboard-accessible date/
duration editing composed from the sibling helper `date-time-picker`
(never arrow-key drag as the only path), row hierarchy, milestones,
percent-complete, a today marker, and dependency data exposed as text.

## 2. Scope

Same as the Svelte reference. In scope: rendering `tasks` against a
`range`/`timeUnit` time axis as a rectangular grid, pointer drag-to-
resize/reschedule, a keyboard-accessible edit surface built from two
composed `DateTimePicker` instances (start, end), row hierarchy with
collapse/expand and derived parent date ranges, milestones
(zero-duration tasks), percent-complete as a data value, a
today-column data flag, finish-to-start dependency data exposed via
`aria-describedby`, APG grid roving-tabindex keyboard navigation, and
`aria-live` change announcements.

Out of scope (v1 non-goals — see §9): dependency-arrow rendering,
virtualization, critical-path calculation, dependency types beyond
finish-to-start, interactive zoom-level switching, weekend/holiday
shading, resource/assignee columns.

## 3. Composition

`GanttChart` depends on `@lilydesignsystem/angular-headless`'s
`GanttTable`, `GanttTableThead`, `GanttTableTbody`, `GanttTableTr`,
`GanttTableTH`, `GanttTableTD` as a real npm dependency, unmodified. It
also depends on the sibling helper
`@lilydesignsystem/angular-date-time-picker` — used **twice** per edit
session, for a task's start and end date — mirroring exactly how
`@lilydesignsystem/angular-picker-bar` depends on four sibling helpers
as real packages (same dependency/build-alias pattern: an
`allowedNonPeerDependencies` entry in `ng-package.json`, a dev-only
`vitest.config.ts`/`tsconfig.json` alias to the sibling's built
`dist/fesm2022`/`dist/types`, since this catalog has no pnpm workspace
linking).

**Deviations found while porting, none requiring a GanttTable-family
change:**

- Angular's headless `GanttTableTD` has **no `active` prop at all**
  (confirmed by reading `GanttTableTD.ts`; only a `className` input
  exists) — so the "prop overload" the Svelte reference deliberately
  avoids (§3 of its own spec: `active` there means the roving-tabindex
  cursor, never span-membership) is not a risk here; there is no
  `active` prop to overload in the first place. Both the roving-
  tabindex cursor (`data-row`/`data-col`/`tabindex`/`aria-selected`)
  and the span-membership marker (`data-in-range`, matching the
  Svelte contract's own resolution) are set via direct attribute
  bindings on the native `<td lily-gantt-table-td>` cell.
- Angular's headless `GanttTable` sets **no `role="grid"`** (Svelte's
  does) — patched by `GanttChart` itself, once, client-side, in
  `ngAfterViewInit()`, the same fix `kanban-board` needed for the
  identical gap in `KanbanTable`.
- Angular's headless `GanttTable` has **no `caption` input** — a
  projected `<caption>` element covers it, same as `kanban-board`.
- `@lilydesignsystem/angular-date-time-picker` already exports the
  civil-date arithmetic this package needs
  (`addDays`, `daysInMonth`, `formatIsoDate`, `parseIsoDate`,
  `toEpochDay`) — reused directly rather than re-derived. Its own
  `compareISO`/`endOfMonth`/`generateColumns`/`flattenTasks`/
  `effectiveRange` are not exported by date-time-picker (they are
  Gantt-specific), so those five are ported here from the Svelte
  reference as plain TypeScript, built on the reused primitives where
  useful (`endOfMonth` calls the reused `daysInMonth`/`parseIsoDate`/
  `formatIsoDate`).

## 4. HTML

```html
<div class="gantt-chart {className}">
  <lily-gantt-table [label]="label"> <!-- role="grid" applied by GanttChart, see §3 -->
    <caption class="gantt-chart-caption">…</caption> <!-- only when caption is set -->
    <thead lily-gantt-table-thead>
      <tr lily-gantt-table-tr>
        <th lily-gantt-table-th scope="col"></th>                 <!-- leading task-label column -->
        <th lily-gantt-table-th scope="col" data-today>{columnLabel(period)}</th>
      </tr>
    </thead>
    <tbody lily-gantt-table-tbody>
      <tr lily-gantt-table-tr>
        <th lily-gantt-table-th scope="row">
          <button class="gantt-chart-collapse-button" aria-expanded>…</button>  <!-- only on parent rows -->
          {taskLabel(task)}
        </th>
        <td lily-gantt-table-td data-row data-col tabindex aria-selected data-in-range data-milestone data-today aria-describedby="{dependencySummaryId}">
          <span class="gantt-chart-bar" data-percent-complete="{n}"></span>     <!-- only in the task's own leading in-range cell -->
        </td>
      </tr>
      <tr class="gantt-chart-edit-row">                            <!-- only while a task is being edited -->
        <td colspan="{columns.length + 1}">
          <lily-date-time-picker [label]="labels.startLabel" [labels]="labels.dateTimePickerLabels" mode="date" [(value)]="editStart" />
          <lily-date-time-picker [label]="labels.endLabel" [labels]="labels.dateTimePickerLabels" mode="date" [(value)]="editEnd" />
          <button class="gantt-chart-save-button">{labels.saveLabel}</button>
          <button class="gantt-chart-cancel-button">{labels.cancelLabel}</button>
        </td>
      </tr>
    </tbody>
  </lily-gantt-table>
  <p class="gantt-chart-status" aria-live="polite"></p>
</div>
```

## 5. Inputs / outputs

| Input       | Type                                                   | Required | Default |
| ----------- | -------------------------------------------------------- | -------- | ------- |
| `label`     | `string`                                                   | yes      | —       |
| `range`     | `{ start: string; end: string }` (ISO dates)               | yes      | —       |
| `tasks`     | `GanttTask[]`                                              | yes      | —       |
| `caption`   | `string`                                                    | no       | `""`    |
| `timeUnit`  | `"day" \| "week" \| "month"`                                | no       | `"day"` |
| `today`     | `string` (ISO date)                                         | no       | `""` (no marker unless supplied; never computed internally, to stay SSR-safe) |
| `taskLabel` | `(task: GanttTask) => string`                               | no       | `task.label` |
| `labels`    | `GanttLabels`                                               | no       | `{}`    |
| `className` | `string`                                                    | no       | `""`    |

| Output       | Type                    | Fires |
| ------------ | ----------------------- | ----- |
| `taskChange` | `GanttTaskChangeEvent` (`{taskId, start, end}`) | After a task's start/end changes, by pointer or by the edit region. Replaces the Svelte contract's `onTaskChange` callback prop, this catalog's established idiom. |

`GanttTask`: `id` (required), `label` (required), `start`/`end` (ISO
dates, required, inclusive; equal values mean a milestone),
`percentComplete?: number`, `parentId?: string`, `dependsOn?: string[]`
(other tasks' ids, finish-to-start).

`GanttLabels` — every field optional, presence gates the control it
names: `columnLabel(start, end, timeUnit)`, `editButton(task)`
(carried for API parity with the Svelte reference; unused there too),
`startLabel`/`endLabel` (each composed `DateTimePicker`'s own
`label`), `dateTimePickerLabels` (a `DateTimePickerLabels` object,
reused for both composed pickers — editing is gated on this being
present, since `date-time-picker` itself requires it), `saveLabel`/
`cancelLabel`, `dependencySummary(predecessorLabels)`,
`dateAnnouncement(taskLabel, start, end)`, `collapseButton(task,
collapsed)`.

## 6. Behaviour

Identical to the Svelte reference's §6 in every particular except the
Angular-specific mechanics already called out in §3
(`role="grid"`/`caption` patched by the component; roving-tabindex and
`data-in-range` set via direct attribute bindings rather than an
`active` prop). In full:

**Time axis.** `range`/`timeUnit` generate a fixed set of columns —
one per day, per 7-day week, or per calendar month — using epoch-day/
UTC arithmetic (reused from `date-time-picker`, see §3) so no column
boundary can land on the wrong day across a DST transition.

**Task bars.** A task's `[start, end]` range is tested for overlap
against every column; overlapping cells carry `data-in-range`. A
milestone (`start === end`) marks its one cell `data-milestone`
instead of a spanning range. `percentComplete`, when set, rides as a
plain attribute (`data-percent-complete`) on the task's own leading
in-range cell.

**Row hierarchy.** `task.parentId` builds a tree, flattened for
rendering with a `depth` used for indentation. A parent row's
`start`/`end` are derived (min start / max end across its descendants)
and rendered read-only. A parent's own `<th lily-gantt-table-th>`
carries a `<button class="gantt-chart-collapse-button" aria-expanded>`
that toggles its children; collapsing removes descendant rows from the
DOM outright.

**Dependencies.** `task.dependsOn` is data, not a rendered arrow: the
dependent task's cell carries `aria-describedby` pointing at a
generated, visually-hidden text node built from
`labels.dependencySummary`.

**Date/duration edit — keyboard.** Enter/Space on a focused
(non-parent) row opens an inline edit region for that task with two
composed `DateTimePicker` instances (`mode="date"`) bound to local
signals seeded from `start`/`end`; Save emits `taskChange` and closes;
Cancel discards. Gated on `labels.dateTimePickerLabels` being
supplied.

**Date/duration edit — pointer.** Native HTML5 drag-and-drop resizes
or reschedules a task's bar; supplementary, never the only path.

**Announcements.** A single `gantt-chart-status` `aria-live="polite"`
region announces successful edits via `labels.dateAnnouncement`.

**SSR.** All DOM writes inside `ngAfterViewInit`/signal `effect()`;
`today` is never computed internally.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, applied by `GanttChart`
itself — see §3). Roving-tabindex focus management for body cells.
Row-header cells (`<th lily-gantt-table-th>`, `scope="row"`) hold each
task's label and, for parents, the collapse button; they sit outside
the roving-tabindex column index.

## 8. Acceptance criteria

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
- §8.10 Saving the edit region emits `taskChange` with the task's id
  and the edited `start`/`end`, then closes the region.
- §8.11 Cancelling the edit region discards changes without emitting
  `taskChange`.
- §8.12 A pointer drag-resize/reschedule of a task's bar emits
  `taskChange` the same way the keyboard path does.
- §8.13 A successful edit (by either path) writes an announcement to
  `gantt-chart-status` (`aria-live="polite"`) built from
  `labels.dateAnnouncement`; no announcement fires when that label is
  absent.
- §8.14 `today`, when supplied, marks its column `data-today`; when
  omitted, no column carries it.
- §8.15 Extra attributes land on `GanttChart`'s own host tag
  (`<lily-gantt-chart>`), one level outside the `.gantt-chart` div —
  same Angular deviation documented for `kanban-board`'s §8.12.
- §8.16 No hardcoded user-facing strings: every label comes from an
  input or a `labels.*` function.

## 9. Non-goals

Dependency-arrow rendering, virtualization, critical-path calculation,
dependency types beyond finish-to-start, interactive zoom-level
switching, weekend/holiday shading, resource/assignee columns. See §2
and
[spec/helpers/index.md § gantt-chart contract](../../../spec/helpers/index.md).

## 10. Relationship to the headless layer and other helpers

`GanttChart` composes three different dependencies in one package: the
structural `GanttTable` family (matching `data-grid`'s and
`kanban-board`'s relationship to their own headless tables), and
`date-time-picker` used twice per edit session — mirroring
`picker-bar`'s own sibling-helper composition pattern exactly (same
`allowedNonPeerDependencies` + dev-only alias mechanism). Follows every
other helper's established rules: headless (no bundled CSS), SSR-safe,
i18n-clean (label-presence gates each control), Angular-idiomatic
(standalone component, signal `input()`/`output()`, `OnPush`).

Two real deviations from the Svelte reference were found and resolved
during this port, documented in §3 above and in this package's own
CHANGELOG.md: Angular's headless `GanttTable`/`GanttTableTD` lack
`role="grid"` and a `caption` input that Svelte's versions have (and,
unlike Svelte's `GanttTableTD`, have no `active` prop to overload in
the first place, so the span-membership-vs-roving-tabindex conflict
the Svelte contract works around never arises here). No headless
change was made to the `GanttTable` family.
