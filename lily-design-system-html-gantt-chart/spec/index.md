# `<gantt-chart>` — Specification

Single source of truth for the `@lilydesignsystem/html-gantt-chart` HTML
helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

Ported from the canonical Svelte helper
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-gantt-chart/spec/index.md).
Per `AGENTS/helpers.md` the Svelte side wins on behaviour; this file
records the vanilla-custom-element idiom and the places the API shape
could not be carried over verbatim (§4 property-only members, §6 reused
date arithmetic, §10 the targeted-insert edit region).

Sibling files:

- `gantt-chart.ts` — the implementation (custom-element class)
- `gantt-chart.test.ts` — vitest + jsdom spec exercising every clause in §8
- `index.ts` — barrel re-export + side-effectful registration (also
  registers `<date-time-picker>`)
- `index.md` — user-facing guide

## 1. Purpose

A headless control that renders a set of tasks against a time axis as an
interactive Gantt chart: task bars as column-spanning grid cells (never
pixel-positioned floating divs), keyboard-accessible date/duration
editing composed from `<date-time-picker>` (never arrow-key drag as the
only path), row hierarchy, milestones, percent-complete, a today marker,
and dependency data exposed as text. The element owns state and
behaviour; it does not own the grid's visual styling.

## 2. Scope

In scope: rendering `tasks` against a `range`/`timeUnit` time axis as a
rectangular grid, pointer drag-to-reschedule, a keyboard-accessible edit
surface built from two composed `<date-time-picker>` instances (start,
end), row hierarchy with collapse/expand and derived parent date ranges,
milestones (zero-duration tasks), percent-complete as a data value, a
today-column data flag, finish-to-start dependency data exposed via
`aria-describedby`, APG grid roving-tabindex keyboard navigation, and an
`aria-live` change-announcement region.

Out of scope (v1 non-goals, identical to the Svelte canonical's §2, not
silent gaps): dependency-arrow rendering, virtualization, critical-path
calculation, dependency types beyond finish-to-start, interactive
zoom-level switching, weekend/holiday shading, resource/assignee
columns.

## 3. Composition

Unlike the Svelte canonical (which composes `@lilydesignsystem/
svelte-headless`'s `GanttTable` family as a real component dependency),
**this catalog's `gantt-table` family in `@lilydesignsystem/
html-headless` is pure markup-CONTRACT documentation** (`.html`
reference templates plus `AGENTS/components-helpers/gantt-table.md`) —
there is no `GanttTable` JS class to import. `<gantt-chart>` builds the
documented class names by hand:

| Contract slug        | Rendered as                          |
| --------------------- | ------------------------------------- |
| `gantt-table`          | `<table class="gantt-table" role="grid">` |
| `gantt-table-thead`    | `<thead class="gantt-table-thead">`  |
| `gantt-table-tbody`    | `<tbody class="gantt-table-tbody">`  |
| `gantt-table-tr`       | `<tr class="gantt-table-tr">`        |
| `gantt-table-th`       | `<th class="gantt-table-th">`        |
| `gantt-table-td`       | `<td class="gantt-table-td">`        |

Note the naming asymmetry with `kanban-table` (which uses `-row`, not
`-tr`) — confirmed against both `.md` naming tables rather than assumed;
see `lily-design-system-html-kanban-board/spec/index.md` §3 for the
kanban side. The contract's own accessibility note is "Implicit table
role" — `<gantt-chart>` sets `role="grid"` itself with no override to
resolve. There is no `active`/roving-tabindex attribute baked into
`gantt-table-td.html`'s contract either (it documents only `aria-label`)
— unlike the Svelte/React/Vue/Angular/Blazor canonicals, this port never
has to work around a `GanttTableTD active` prop overload, because there
is no such prop to begin with. Every element is built exclusively via
`document.createElement`/`appendChild`, never `innerHTML` or a template
string — see `lily-design-system-html-kanban-board/spec/index.md` §3 for
the full parser-safety rationale (identical here).

`<gantt-chart>` composes `@lilydesignsystem/html-date-time-picker` twice
per edit session (task start, task end) — the sibling-helper composition
pattern `@lilydesignsystem/html-picker-bar` established for this catalog
(bare side-effect import to register the element, `import type` for
types, property assignment via `document.createElement("date-time-picker")
as DateTimePicker`). See `picker-bar.ts` for the precedent this follows.

## 4. API surface

Mirrors `date-time-picker`'s own §4.3 "property-only members" rule:
arrays of objects and functions cannot be HTML attributes.

**Observed attributes** (string-valued, reflected as properties):
`label` (required), `caption` (optional), `time-unit` (`"day" | "week" |
"month"`, default `"day"`; an unrecognised value falls back to `"day"`,
matching `date-time-picker`'s own unrecognised-attribute-value rule),
`today` (optional ISO date; never computed internally — see §6), `class`.

**Property-only members:**

| Property        | Type                                                   | Required | Default |
| ---------------- | -------------------------------------------------------- | -------- | ------- |
| `range`          | `{ start: string; end: string }` (ISO dates)               | yes      | —       |
| `tasks`          | `GanttTask[]`                                              | yes      | `[]`    |
| `taskLabel`      | `(task: GanttTask) => string`                               | no       | `task.label` |
| `onTaskChange`   | `(taskId: string, start: string, end: string) => void`      | no       | —       |
| `labels`         | `GanttLabels`                                               | no       | `{}`    |

`GanttTask`: `id` (required), `label` (required), `start`/`end` (ISO
dates, required, inclusive; equal values mean a milestone),
`percentComplete?: number`, `parentId?: string`, `dependsOn?: string[]`
(other tasks' ids, finish-to-start).

`GanttLabels` — every field optional, but presence gates the control it
names: `columnLabel(start, end, timeUnit)`, `editButton(task)`,
`startLabel`/`endLabel` (passed as each composed `<date-time-picker>`'s
own `label`), `dateTimePickerLabels` (a `DateTimePickerLabels` object,
reused for both composed pickers — editing is gated on this being
present, since `date-time-picker` itself requires it), `saveLabel`/
`cancelLabel`, `dependencySummary(predecessorLabels)`,
`dateAnnouncement(taskLabel, start, end)`, `collapseButton(task,
collapsed)`.

**Event.** Every change — by pointer or by the edit region — fires a
bubbling, composed `taskchange` `CustomEvent` with
`detail: { taskId: string; start: string; end: string }`, paired with
the `onTaskChange` property.

**Utility exports** (from `gantt-chart.ts`/`index.ts`): `addDays`
(re-exported straight from `@lilydesignsystem/html-date-time-picker` —
see §6), `compareISO`, `endOfMonth`, `generateColumns`, `flattenTasks`,
`effectiveRange`.

## 5. HTML

```html
<gantt-chart label="Q4 plan">
  <div class="gantt-chart {class}">
    <table class="gantt-table" role="grid" aria-label="{label}">
      <caption>{caption}</caption> <!-- only when caption is set -->
      <thead class="gantt-table-thead">
        <tr class="gantt-table-tr">
          <th class="gantt-table-th" scope="col"></th>                 <!-- leading task-label column -->
          <th class="gantt-table-th" scope="col" data-today>{columnLabel(period)}</th>
        </tr>
      </thead>
      <tbody class="gantt-table-tbody">
        <tr class="gantt-table-tr">
          <th class="gantt-table-th" scope="row" data-depth="{depth}">
            <button class="gantt-chart-collapse-button" aria-expanded="true|false">…</button>  <!-- only on parent rows -->
            {taskLabel(task)}
            <span class="gantt-chart-dependency-summary" hidden>{dependencySummary}</span>     <!-- only when deps + label -->
          </th>
          <td class="gantt-table-td" data-row="{r}" data-col="{c}" tabindex="0|-1"
              data-in-range data-milestone data-today aria-describedby="{dependencySummaryId}">
            <span class="gantt-chart-bar" data-percent-complete="{n}"></span>     <!-- only in the task's own leading in-range cell -->
          </td>
        </tr>
        <tr class="gantt-chart-edit-row">                            <!-- only while this task is being edited -->
          <td colspan="{columns.length + 1}">
            <date-time-picker class="gantt-chart-start-picker" label="{labels.startLabel}" mode="date"></date-time-picker>
            <date-time-picker class="gantt-chart-end-picker" label="{labels.endLabel}" mode="date"></date-time-picker>
            <button class="gantt-chart-save-button">{labels.saveLabel}</button>
            <button class="gantt-chart-cancel-button">{labels.cancelLabel}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="gantt-chart-status" aria-live="polite"></p>
  </div>
</gantt-chart>
```

## 6. Behaviour

**Time axis.** `range`/`timeUnit` generate a fixed set of columns — one
per day, per 7-day week, or per calendar month — using civil-date
(UTC/epoch-day) arithmetic, never local-midnight `Date` construction.
**This port reuses `@lilydesignsystem/html-date-time-picker`'s own
exported `addDays`, `parseIsoDate`, `formatIsoDate`, `daysInMonth`, and
`toEpochDay` functions rather than re-implementing civil-date math** —
the same functions a consumer wiring `min`/`max` on that picker already
reaches for, checked and confirmed reusable before writing anything new
(see §10.2). Only `compareISO` (plain string comparison — zero-padded
ISO dates order lexically) and `endOfMonth` (no equivalent export)
are added locally, both pure and independently tested.

**Task bars.** A task's `[start, end]` range is tested for overlap
against every column; overlapping cells carry `data-in-range`. A
milestone (`start === end`) marks its one cell `data-milestone` instead
of a spanning range. `percentComplete`, when set, rides as a plain
attribute (`data-percent-complete`) on the task's own leading in-range
cell.

**Row hierarchy.** `task.parentId` builds a tree, flattened for
rendering with a `depth` used for indentation. A parent row's
`start`/`end` are derived (min start / max end across its descendants)
and rendered read-only. The row-header `<button
class="gantt-chart-collapse-button">` toggles a parent's children;
collapsing removes descendant rows from the DOM outright. Because
collapsing/expanding renumbers every subsequent row's `data-row` index,
this is a **structural** rebuild of the `<tbody>` (via `#render()`),
not a targeted patch — see §10.3 for why editing does NOT pay this same
cost.

**Dependencies.** `task.dependsOn` is data, not a rendered arrow: every
cell in the dependent task's row carries `aria-describedby` pointing at
a generated, `hidden` text node built from `labels.dependencySummary`.
No dependency line is drawn.

**Date/duration edit — keyboard.** Enter/Space on a focused (non-parent)
row opens an inline edit region for that task: a single `<tr
class="gantt-chart-edit-row">` inserted immediately after the task's own
row, containing two composed `<date-time-picker mode="date">` instances
seeded from that task's current `start`/`end`. Save calls `onTaskChange`
(and dispatches `taskchange`) and closes the region; Cancel discards.
Gated on `labels.dateTimePickerLabels` being supplied.

**Date/duration edit — pointer.** Native HTML5 drag-and-drop reschedules
a task's bar, preserving its duration; supplementary, never the only
path.

**Announcements.** A single `.gantt-chart-status[aria-live="polite"]`
region announces successful edits via `labels.dateAnnouncement`.

**`today`.** Never computed internally — a server-computed "today" and a
client-computed one can disagree across a render boundary. No marker
renders unless the consumer supplies the `today` attribute/property.

**Custom-element lifecycle.** No work happens before
`connectedCallback()`. Setting `range`, `tasks`, `taskLabel`, or `labels`
(or changing the `time-unit`/`today`/`label`/`caption`/`class`
attributes) triggers a full structural rebuild, closing any open edit
region. Toggling a row's collapse state also triggers a full rebuild,
for the reasoning §10.3 explains — but opening/closing the edit region
itself does **not** rebuild anything; see §10.3.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, set directly since the
headless `gantt-table` contract specifies no default role). Roving-
tabindex focus management for body cells; row-header cells
(`gantt-table-th`, `scope="row"`) hold each task's label and, for
parents, the collapse button, and sit outside the roving-tabindex column
index. Editing via composed `<date-time-picker>` is the accessible path
for rescheduling/resizing; drag is supplementary, never required.

## 8. Acceptance criteria

- §8.1 Renders `<div class="gantt-chart">` wrapping a
  `<table class="gantt-table" role="grid">` whose `aria-label` comes
  from `label`.
- §8.2 Generates one column per day/week/month across `range` according
  to `timeUnit`, using UTC/epoch-day arithmetic (reused from
  `html-date-time-picker`).
- §8.3 A task's `[start, end]` marks every overlapping column's cell
  `data-in-range`; a milestone (`start === end`) marks exactly one cell
  `data-milestone` instead.
- §8.4 `percentComplete` renders as `data-percent-complete` on the
  task's leading in-range cell only when set.
- §8.5 A task with `parentId` renders nested under its parent with a
  `depth`-based indentation; the parent's own cells reflect its derived
  `start`/`end` (min/max of its descendants), not its own data.
- §8.6 A parent row's collapse button toggles `aria-expanded` and
  removes/restores descendant rows from the DOM outright.
- §8.7 A task's `dependsOn` produces `aria-describedby` references to a
  generated summary built from `labels.dependencySummary`; a task with
  no dependencies carries neither.
- §8.8 Exactly one body cell carries `tabindex="0"` at any time; arrow
  keys move it and clamp at the grid's edges rather than wrapping.
- §8.9 Enter/Space on a focused non-parent row opens an inline edit
  region with two composed `<date-time-picker>` instances, only when
  `labels.dateTimePickerLabels` is supplied; a parent row does not open
  one; opening it does not rebuild or lose the roving-tabindex cursor's
  own DOM node (see §10.3).
- §8.10 Saving the edit region calls `onTaskChange` (and dispatches
  `taskchange`) with the task's id and the edited `start`/`end`, then
  closes the region.
- §8.11 Cancelling the edit region discards changes without calling
  `onTaskChange`.
- §8.12 A pointer drag-resize/reschedule of a task's bar calls
  `onTaskChange` the same way the keyboard path does, preserving the
  task's original duration.
- §8.13 A successful edit (by either path) writes an announcement to
  `.gantt-chart-status` (`aria-live="polite"`) built from
  `labels.dateAnnouncement`; no announcement fires when that label is
  absent.
- §8.14 `today`, when supplied, marks its column `data-today`; when
  omitted, no column carries it — nothing is computed internally.
- §8.15 Any extra HTML attribute a consumer sets directly on the
  `<gantt-chart>` element is already present on that element without
  any forwarding step (see §10.4, mirrors kanban-board's §10.4).
- §8.16 No hardcoded user-facing strings: every label comes from a
  property or a `labels.*` function.

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

Dependency-arrow rendering, virtualization, critical-path calculation,
dependency types beyond finish-to-start, interactive zoom-level
switching, weekend/holiday shading, resource/assignee columns. See §2
and [spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md).

## 10. Deviations from the Svelte canonical

1. **No `GanttTable` component dependency.** This catalog's headless
   layer ships markup-contract `.html` files, not JS classes (see §3).

2. **Civil-date arithmetic is reused, not re-ported.** The Svelte
   canonical hand-writes `parseISOToEpochDay`/`epochDayToISO`/`addDays`/
   `endOfMonth` locally. This port checked
   `@lilydesignsystem/html-date-time-picker`'s own exports first (per
   this port's own instructions) and found `addDays`, `parseIsoDate`,
   `formatIsoDate`, `daysInMonth`, and `toEpochDay` already cover
   everything except `compareISO` (trivial string comparison) and
   `endOfMonth` (composed from the reused `daysInMonth` +
   `formatIsoDate`). Reduces the surface that could silently drift from
   the sibling picker's own date semantics.

3. **The edit region is a targeted DOM insert, not a structural
   rebuild.** The Svelte canonical's reactivity makes this distinction
   invisible — opening/closing the edit region is just another
   reactive branch. In a vanilla custom element, `#openEdit()` inserts
   exactly one `<tr class="gantt-chart-edit-row">` immediately after the
   task's existing `<tr>` (`row.insertAdjacentElement("afterend", tr)`)
   and `#closeEdit()` removes it — the grid's own DOM, including
   whichever cell currently holds `tabindex="0"`, is never touched.
   `gantt-chart.test.ts` includes a dedicated test asserting the exact
   same `<td>` node (`toBe`, not a class-name check) still carries
   `tabindex="0"` and remains connected after opening an edit region —
   confirmed load-bearing by temporarily routing `#openEdit()` through a
   full `#render()` and observing that test fail. Collapsing a row, by
   contrast, DOES trigger a full `<tbody>` rebuild, because it
   renumbers every subsequent row's `data-row` index — a genuinely
   structural change, not a cosmetic one.

4. **`GanttTableTD`'s Svelte-side `active`-prop overload risk does not
   exist here.** The Svelte canonical's §3 spends a full section
   explaining why `active` (the roving-tabindex cursor) must stay
   separate from "this cell is within the task's span"
   (`data-in-range`), because `GanttTableTD`'s own `active` prop is
   wired to `aria-selected`/`tabindex` in that catalog (until 2026-10-10;
   it now sets `tabindex` only). This catalog's
   `gantt-table-td.html` contract documents only `aria-label` — there is
   no `active` prop to begin with, so this port sets `tabindex`
   (roving cursor; never `aria-selected`) and `data-in-range` (span membership)
   as two independent, always-compatible attributes with no risk to
   document a workaround for.

5. **§8.15 "extra attributes spread onto the root" is re-scoped** —
   identical reasoning to `kanban-board`'s spec §10.4.

6. **`taskchange` event.** Not present in the Svelte canonical (which
   uses only the `onTaskChange` prop). Added to match this catalog's
   callback/event pairing convention.

## 11. Tracking

- Package directory: `lily-design-system-html-gantt-chart/` (top-level subproject; until 2026-10-10 inside `lily-design-system-html-helpers/`)
- Spec version: 0.1.0
- Created: 2026-09-22
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;

---

Lily™ and Lily Design System™ are trademarks.

## Svelte 0.2.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§12 there): `readonly`, `markers` (`data-marker` plus a text label), `isNonWorking` (`data-non-working` when every day in a column is non-working), and task `type`/`critical`/`slack` as `data-*` hooks on the row.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there): the progress field (`labels.percentLabel`, a 4th `onTaskChange` argument), baselines (`task.baseline`, `data-baseline`, `labels.baselineSummary`) and typed dependencies (`dependsOn` objects, `labels.dependencyDetail`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §14.1–§14.17): zoom (`timeUnit`, `labels.zoomIn` / `zoomOut`), drag-resize handles, task selection (`selectedTaskId`, `onTaskSelect`, the `s` key), Alt+ArrowLeft/Right shift and Alt+Shift+Arrow end move, and `taskAttrs`.

## Unscheduled tasks and collapse-all (2026-10-16)

Ported from the Svelte canonical (its spec "Unscheduled tasks and collapse-all", tests §14.18–§14.24). `start` / `end` are optional on a task: with neither, the row renders no bar and no `data-in-range` cells and carries `data-unscheduled`; the edit region opens with empty dates and Save is disabled until both are set. `effectiveRanges` skips an unscheduled child when deriving a parent's span (a parent whose children are all unscheduled has an empty range and is unscheduled itself). Drag, resize and Alt+Arrow ignore an unscheduled task, and a baseline variance with no current end is 0. `collapsedTaskIds` holds the collapsed parent ids; `labels.expandAll` / `labels.collapseAll` gate two buttons in `.gantt-chart-collapse-all` (shown only when the chart has parents), each disabled when it would change nothing. The HTML edit region now syncs Save's disabled state when it opens, not only on a date change.

## 12. Typed fields, inline editing, export, virtualization (0.5.0, 2026-10-16)

Tests §14.25–§14.40. The data grid's cell types, export and windowing, applied to tasks.

- **Typed fields**: `fields` is a list of `{ id, header, type?, options?, numberFormat?, dateFormat?, parse?, exportValue?, exportable?, editable?, editLabel? }`, read from `task.values[id]`.
  Each is a column (`th scope="col"` plus a `GanttTableTD` per row, `data-field`, `data-type`) between the task name and the timeline. `type` is a data-grid cell type; `resolveColumn` fills in the
  type's `format`, `compare` and `exportValue`, once per `fields` / `locale` change. With no `locale` a value shows as stored. The field cells carry no `data-row` / `data-col`, so the roving timeline grid is unchanged.
- **Inline editing**: Setting `onFieldEdit` (called with `{ taskId, fieldId, value, previous }`; the `fieldedit` event carries the same, and `editableFields` turns editing on for a consumer that only listens, since an element cannot see its own listeners) turns it on (and not `readonly`, not `editable: false`). `text`, `number`, `link`, `date`, `time`, `select` and `radio` fields edit; the others
  display and export only. The value becomes a `.gantt-chart-field-button` (`tabindex="-1"`, named by the header plus the value); clicking it, or **F2** on a timeline cell (first editable field of the row), opens
  `.gantt-chart-field-editor` (an `<input>` of the type, or a `<select>` of `options`). **Enter** commits, **Escape** cancels, blur commits, **Tab** / **Shift+Tab** commit and move to the row's next / previous editable field.
  The editor owns its keys, and while an IME is composing (`isComposing`, or `keyCode` 229) Enter, Escape and Tab belong to the IME. A value that does not fit the type is refused (the editor stays open,
  `labels.editInvalid`); an unchanged value reports nothing; `labels.editAnnouncement(task, header, text)`. Parent tasks' fields are their own data and edit like any other.
- **Export**: `labels.exportCsv` / `exportTsv` / `exportExcel` each gate a `.gantt-chart-export-button` (`data-gantt-export-format`) in a `.gantt-chart-export` group named by `labels.export`; none renders without
  `labels.exportHeaders`. One row per task in tree order: task label, start, end (a parent's derived span; real dates in Excel, empty for an unscheduled task), then — each only when its header is named — percent
  complete, parent label, predecessors (`; ` joined), baseline start and end; then every `exportable` field. `exportScope` `"all"` (default) or `"visible"` (leaves out tasks under a collapsed parent).
  Formula-looking text is defused. `onExport` (given `{ format, filename, taskCount, blob }`; the `exportfile` event carries the same) may return `false` to take over; otherwise the file is saved and `labels.exportAnnouncement` is announced.
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

