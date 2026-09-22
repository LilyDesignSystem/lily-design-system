# GanttChart — Specification (Nunjucks helper)

Canonical contract for `@lilydesignsystem/nunjucks-gantt-chart`. Ports
[the Svelte canonical's spec](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/spec/index.md)
(proposed 2026-09-21 in
[spec/helpers/index.md § gantt-chart contract](../../../spec/helpers/index.md))
to this catalog's macro + client.js architecture, alongside
[kanban-board](../../lily-design-system-nunjucks-kanban-board/spec/index.md),
which this package also uses as a second local reference for the
established macro + client.js shape. The DOM contract and behaviour
match clause-for-clause where a Nunjucks macro CAN render the same
thing the Svelte canonical does; §3 explains the one place they
structurally cannot, and why.

## 1. Purpose

A headless control that renders a set of tasks against a time axis as
an interactive Gantt chart: task bars as column-spanning grid cells
(never pixel-positioned floating divs), keyboard-accessible date/
duration editing composed from `@lilydesignsystem/nunjucks-date-time-
picker` (never arrow-key drag as the only path), row hierarchy,
milestones, percent-complete, a today marker, and dependency data
exposed as text.

## 2. Scope

In scope: rendering `tasks` against a `range`/`timeUnit` time axis as
a rectangular grid, pointer drag-to-reschedule, a keyboard-accessible
edit surface built from two composed `date-time-picker` instances
(start, end), row hierarchy with collapse/expand and derived parent
date ranges, milestones (zero-duration tasks), percent-complete as a
data value, a today-column data flag, finish-to-start dependency data
exposed via `aria-describedby`, APG grid roving-tabindex keyboard
navigation, and `aria-live` change announcements.

Out of scope (v1 non-goals, not silent gaps — see §9): dependency-arrow
rendering, virtualization, critical-path calculation, dependency types
beyond finish-to-start, interactive zoom-level switching, weekend/
holiday shading, resource/assignee columns. Matches the Svelte
canonical's own non-goal list exactly — see that spec §9 for the
accessibility research behind the dependency-arrow non-goal in
particular.

## 3. Composition, and why the grid body is entirely client-built

`gantt-chart.njk` imports, unmodified, `@lilydesignsystem/nunjucks-
headless`'s gantt-table macro family (`ganttTable`, `ganttTableThead`,
`ganttTableTbody`, `ganttTableTr`, `ganttTableTh`, `ganttTableTd`) —
the same "depend on, don't vendor" rule kanban-board follows for its
own headless dependency. It ALSO imports `@lilydesignsystem/nunjucks-
date-time-picker`'s `dateTimePicker` macro, called TWICE per editable
row (start date, end date) — the first helper-to-helper macro
composition in this catalog, mirroring `picker-bar.njk`'s "import a
sibling PACKAGE's macro, don't vendor it" pattern.

**Generating the `range`/`timeUnit` column list needs real civil-date
arithmetic** — days in a month, leap years, month-end clamping — the
same class of computation `date-time-picker.njk`'s own header comment
explains Nunjucks cannot do at all (no custom filters are registered
in this catalog). Every per-cell flag that depends on those columns
(`data-in-range`, `data-milestone`, `data-today`, which cell is a
bar's "leading" cell) inherits the same limitation transitively.

So, exactly like `date-time-picker.njk` splits "the calendar's FIXED
markup" from "the Intl-dependent interior" (built by its own client.js
on first run), `gantt-chart.njk` renders every piece of markup whose
content is fixed at render time:

- the root wrapper and status region,
- the table's leading (blank) header cell,
- one `<tr>` per task in hierarchy order (row header: label, collapse
  button, dependency summary — a `parentId` tree walk needs no date
  math),
- each editable leaf task's own inline edit region, calling
  `dateTimePicker` TWICE — plain macro composition; no date math is
  needed to RENDER two date pickers, only to compute what goes IN a
  Gantt cell,

and leaves entirely to `gantt-chart.client.js`:

- the date-column `<th>` cells (one per generated column),
- every body `<td>` cell in every row (`data-in-range`/`-milestone`/
  `-today`, the task bar, its `data-percent-complete`).

**A parent task's own derived range (min start / max end across its
descendants) is the one exception that CAN, and does, run in
Nunjucks** — it is pure string min/max comparison over already-known
`start`/`end` fields (ISO date strings compare correctly
lexicographically; no day-count or month-length knowledge is needed),
computed by a small recursive macro (`_ganttChartEffectiveRange`) and
baked onto each row as `data-lily-gantt-chart-start`/`-end` at render
time. `gantt-chart.client.js` never recomputes it — see §6.

A grid with rows but no date columns or cells is what a no-JS user
sees — the same real, documented no-JS regression `date-time-
picker.njk` already accepts for its own calendar grid.

## 4. Macro parameters and Nunjucks deviations

| Svelte prop | Nunjucks shape | Rule |
| --- | --- | --- |
| `taskLabel: (task) => string` | not a macro param | Always renders `task.label` — same rule as kanban-board's `cardLabel`. |
| `labels.columnLabel(start, end, timeUnit)` | `initGanttChart(root, {labels: {columnLabel}})` — stays a real function | Columns are entirely client-built (§3), so there is no render-time value to substitute a template string into. The Svelte fallback (`?? column.start`) is preserved client-side. |
| `labels.dateAnnouncement(taskLabel, start, end)` | `initGanttChart(root, {labels: {dateAnnouncement}})` — stays a real function | An edit only ever completes after hydration — same reasoning as kanban-board's `moveAnnouncement`. |
| `labels.dependencySummary(predecessorLabels)` | `labels.dependencySummary` — template string, `{predecessors}` token | Unlike `columnLabel`, everything it needs (other tasks' own labels, resolved by id) is known at render time — no date math. The macro joins the resolved labels with `", "` itself before substituting. |
| `labels.collapseButton(task, collapsed)` | `labels.collapseLabel` / `labels.expandLabel` — two template strings, `{task}` token each | One callback covering two states in Svelte; a single Nunjucks template string cannot branch on `collapsed`. The macro renders the INITIAL button (every row starts expanded) using `collapseLabel`; both raw templates also ride on the button as `data-lily-gantt-chart-collapse-label`/`-expand-label` so `gantt-chart.client.js` can recompute the OTHER state's label on toggle without the consumer passing the same strings twice. |
| `labels.startLabel` / `labels.endLabel` | plain strings, macro params | Forwarded as each composed `dateTimePicker`'s own `label`. |
| `labels.dateTimePickerLabels` | object, macro param | Forwarded as-is to both composed date pickers' own `labels`. Editing is gated on this being present — matches `date-time-picker`'s own "labels are required" contract. |
| `labels.saveLabel` / `labels.cancelLabel` | plain strings, macro params | Button text. |
| `onTaskChange: (taskId, start, end) => void` | `initGanttChart(root, {onTaskChange})` — client.js init option | Same reasoning as `dateAnnouncement`. |

Params (single `opts` object):

| Param | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `string` | yes | — |
| `range` | `{start, end}` (ISO dates) | yes | — |
| `tasks` | `array<{id, label, start, end, percentComplete?, parentId?, dependsOn?}>` | yes | — |
| `caption` | `string` | no | — |
| `timeUnit` | `"day" \| "week" \| "month"` | no | `"day"` |
| `today` | `string` (ISO date) | no | — (no marker unless supplied) |
| `labels` | `object` (see table above) | no | `{}` |
| `name` | `string` | no | `"chart"` |
| `id` | `string` | no | `"gantt-chart-{name}"` |
| `classes` | `string` | no | — |
| `attributes` | `object` | no | — |

`GanttTask`: `id`, `label`, `start`/`end` (ISO dates, inclusive; equal
values mean a milestone) required; `percentComplete?: number`,
`parentId?: string`, `dependsOn?: string[]` optional.

## 5. Implementation notes — Nunjucks scoping and recursion

Every nested composition is built with plain macro-call expressions
(`{{ someMacro(args) }}`), bottom-up, as `| safe`-marked HTML strings —
never nested `{% call %}` blocks — the same Nunjucks scoping trap
kanban-board's own header comment documents. Row hierarchy is walked
with a RECURSIVE macro (`_ganttChartRowsHtml`), confirmed to work in
this Nunjucks version: a macro calling itself, returning its own
output bottom-up, is how a `parentId` tree of unknown depth is
rendered in depth-first order without a `while` loop (which Nunjucks
does not have) or a mutable stack (Nunjucks arrays are immutable;
`.concat()` returns a new array, matching kanban-board's own
accumulation style).

## 6. HTML

```
<div class="gantt-chart {classes}" data-lily-gantt-chart-root
     data-lily-gantt-chart-range-start="{range.start}"
     data-lily-gantt-chart-range-end="{range.end}"
     data-lily-gantt-chart-time-unit="{timeUnit}"
     data-lily-gantt-chart-today="{today}">        <!-- only when today is supplied -->
  <table class="gantt-table" role="grid" aria-label="{label}">
    <thead class="gantt-table-thead">
      <tr class="gantt-table-tr" data-lily-gantt-chart-header-row>
        <th class="gantt-table-th" scope="col"></th>   <!-- leading blank column, SSR'd -->
        <!-- one <th scope="col"> per generated column, appended by client.js -->
      </tr>
    </thead>
    <tbody class="gantt-table-tbody">
      <tr class="gantt-table-tr" data-lily-gantt-chart-task-id data-lily-gantt-chart-depth
          data-lily-gantt-chart-start data-lily-gantt-chart-end>
        <th class="gantt-table-th" scope="row" style="padding-inline-start: {depth}em">
          <button class="gantt-chart-collapse-button" aria-expanded="true">…</button>  <!-- only on parent rows -->
          {task.label}
          <span class="gantt-chart-dependency-summary" hidden>{dependencySummary substituted}</span>  <!-- only when deps exist and the label is set -->
        </th>
        <!-- one <td class="gantt-table-td"> per generated column, appended by client.js -->
      </tr>
      <tr class="gantt-chart-edit-row" hidden>          <!-- only for non-parent tasks, only when dateTimePickerLabels is set -->
        <td>
          <!-- two composed dateTimePicker macro calls, seeded with the task's own start/end -->
          <button class="gantt-chart-save-button">{saveLabel}</button>
          <button class="gantt-chart-cancel-button">{cancelLabel}</button>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="gantt-chart-status" aria-live="polite"></p>
</div>
```

## 7. Behaviour

**Time axis.** `gantt-chart.client.js` generates one column per day,
7-day week, or calendar month across `range`, using UTC/epoch-day
arithmetic — reusing `@lilydesignsystem/nunjucks-date-time-picker`'s
exported `addDays`/`parseIsoDate`/`formatIsoDate`/`daysInMonth`/
`toEpochDay` rather than re-deriving them, and porting only what that
package does not itself need (`compareISO`, `endOfMonth`,
`generateColumns`, `rangesOverlap`) from the Svelte canonical's
`<script module>` block.

**Task bars.** A task's `[start, end]` (or, for a parent, its DERIVED
range — see §3) is tested for overlap against every column;
overlapping cells carry `data-in-range`. A milestone (`start === end`)
marks its one cell `data-milestone`. `percentComplete` rides as
`data-percent-complete` on the task's own leading in-range cell.

**Row hierarchy.** `task.parentId` builds a tree at RENDER TIME (§3);
`gantt-chart.client.js` never re-walks it. A parent row's collapse
button toggles a contiguous run of next-sibling `<tr>` elements
(itself, and each descendant's own edit-row, if any) whose own
`data-lily-gantt-chart-depth` is greater than the parent's — REMOVED
from the DOM outright on collapse (never just hidden — the same
"remove, don't just hide" rule `data-grid` applies to hidden columns),
and re-inserted, in original order, on expand. See
[spec/helpers/index.md](../../../spec/helpers/index.md) for why depth
alone is sufficient: `flattenTasks`'s depth-first order means a row's
descendants are always contiguous.

**Dependencies.** `task.dependsOn` is resolved to other tasks' own
labels AT RENDER TIME (a lookup by id, not a date computation) and
rendered as a visually-hidden summary in the row's own header cell;
every body `<td>` in that row carries `aria-describedby` pointing at
it. No dependency line is drawn — see §9.

**Date/duration edit — keyboard.** Enter/Space on a focused non-parent
row opens that row's own (always-rendered, hidden) edit region: two
composed `DateTimePicker` instances, `mode="date"`. Gated on
`labels.dateTimePickerLabels` — when absent, no edit row is rendered
at all, anywhere.

`gantt-chart.client.js` calls `initDateTimePicker` FRESH every time an
edit region opens, and `destroy()`s both controllers on close (Save or
Cancel) — `date-time-picker.client.js` exposes no imperative
"reset to this value" call, so re-seeding the underlying hidden input
and text field to the task's OWN original `start`/`end` (carried on
the edit row as `data-lily-gantt-chart-original-start`/`-end`) before
each fresh `initDateTimePicker` call is how this module guarantees
Cancel, or simply re-opening, never shows a stale half-typed edit from
a previous session. Save reads both controllers' `getValue()`.

**Date/duration edit — pointer.** Native HTML5 drag-and-drop from a
task's bar reschedules it, preserving its own duration (computed via
`toEpochDay`/`parseIsoDate`, both reused from `date-time-picker`).
Supplementary, never the only path.

**Announcements.** A single `.gantt-chart-status[aria-live="polite"]`
region announces successful edits via `labels.dateAnnouncement`.

**SSR.** The macro is pure; `today` is never computed internally — no
marker renders unless the consumer supplies it. The macro-rendered
grid has rows but no date columns or cells (§3) until
`gantt-chart.client.js` runs.

## 8. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, set explicitly). Roving-
tabindex focus management for body cells, scoped to the CURRENTLY
VISIBLE row list (collapse/expand changes it) rather than a count
baked in at render time. Row-header cells (`scope="row"`) hold each
task's label and, for parents, the collapse button; they sit outside
the roving-tabindex column index.

## 9. Acceptance criteria

- §9.1 Renders `<div class="gantt-chart">` wrapping a `<table
  role="grid">` whose `aria-label` comes from `label`.
- §9.2 Generates one column per day/week/month across `range`
  according to `timeUnit`, using UTC/epoch-day arithmetic.
- §9.3 A task's `[start, end]` marks every overlapping column's cell
  `data-in-range`; a milestone (`start === end`) marks exactly one
  cell `data-milestone` instead.
- §9.4 `percentComplete` renders as `data-percent-complete` on the
  task's leading in-range cell only when set.
- §9.5 A task with `parentId` renders nested under its parent with a
  `depth`-based indentation; the parent's own `start`/`end` (rendered
  server-side, per §3) are derived (min/max of its descendants), not
  its own data.
- §9.6 A parent row's collapse button toggles `aria-expanded` and
  removes/restores descendant rows — AND their own edit rows, if any —
  from the DOM outright.
- §9.7 A task's `dependsOn` produces `aria-describedby` references (on
  every cell of that row) to a generated summary built from
  `labels.dependencySummary`; a task with no dependencies carries
  neither.
- §9.8 Exactly one body cell carries `tabindex="0"` at any time; arrow
  keys move it and clamp at the CURRENT grid's edges (accounting for
  collapse/expand) rather than wrapping.
- §9.9 Enter/Space on a focused non-parent row opens an inline edit
  region with two composed `DateTimePicker` instances, only when
  `labels.dateTimePickerLabels` is supplied (no edit row exists at all
  otherwise); a parent row's edit row never exists.
- §9.10 Saving the edit region calls `onTaskChange` with the task's id
  and the edited `start`/`end`, then closes the region.
- §9.11 Cancelling the edit region discards changes without calling
  `onTaskChange`; re-opening (after Cancel, or fresh) always shows the
  task's OWN original dates, never a stale typed value from a previous
  session (§7).
- §9.12 A pointer drag-reschedule of a task's bar calls `onTaskChange`
  the same way the keyboard path does, preserving the task's own
  duration.
- §9.13 A successful edit (by either path) writes an announcement to
  `gantt-chart-status` (`aria-live="polite"`) built from
  `labels.dateAnnouncement`; no announcement fires when that label is
  absent.
- §9.14 `today`, when supplied, marks its column header AND every
  matching body cell `data-today`; when omitted, no column or cell
  carries it.
- §9.15 Extra attributes spread onto the root `<div>`.
- §9.16 No hardcoded user-facing strings: every label comes from a
  macro param, a `labels.*` template string, or a `labels.*` client.js
  init option.

## 10. Relationship to the headless layer and other helpers

`gantt-chart.njk` composes three different dependencies: the
structural gantt-table macro family (matching kanban-board's
relationship to kanban-table), `@lilydesignsystem/nunjucks-date-time-
picker`'s `dateTimePicker` macro used TWICE per edit session (the
first helper-to-helper macro composition in this catalog, mirroring
`picker-bar`'s sibling-package-import pattern), and, transitively via
`gantt-chart.client.js`, `date-time-picker`'s exported civil-date
arithmetic functions (reused, not re-derived — see §7). Follows every
other helper's established rules: headless (no bundled CSS), SSR-safe
where the underlying computation allows it (§3), i18n-clean
(label-presence gates each control), macro + client.js architecture
throughout.
