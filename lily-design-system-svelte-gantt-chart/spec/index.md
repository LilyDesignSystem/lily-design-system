# GanttChart — Specification (Svelte helper)

Canonical contract for `@lilydesignsystem/svelte-gantt-chart`. Proposed
2026-09-21 in [spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md).
Svelte is the canonical implementation; the other seven frameworks
port it (`lily-design-system-{framework}-gantt-chart`).

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
a rectangular grid, pointer drag-to-resize/reschedule, a
keyboard-accessible edit surface built from two composed
`date-time-picker` instances (start, end), row hierarchy with
collapse/expand and derived parent date ranges, milestones
(zero-duration tasks), percent-complete as a data value, a today-column
data flag, finish-to-start dependency data exposed via
`aria-describedby`, APG grid roving-tabindex keyboard navigation, and
`aria-live` change announcements.

Out of scope (v1 non-goals, not silent gaps — see §9): dependency-arrow
rendering, virtualization, critical-path calculation, dependency types
beyond finish-to-start, interactive zoom-level switching, weekend/
holiday shading, resource/assignee columns. Each either requires real
visual/layout ownership that conflicts with "no bundled CSS, no
rendering opinion," is a scheduling algorithm over the consumer's own
data rather than a rendering concern, or is a v2-sized feature better
designed once v1 ships and is exercised in a real app.

## 3. Composition

`GanttChart` depends on `@lilydesignsystem/svelte-headless`'s
`GanttTable`, `GanttTableThead`, `GanttTableTbody`, `GanttTableTr`,
`GanttTableTH`, `GanttTableTD` as a real npm dependency and renders
them unmodified — the same "depend on, don't vendor" rule `data-grid`
and `kanban-board` follow for their own headless table families. It
also depends on `@lilydesignsystem/svelte-date-time-picker` — the
first helper proposed to compose a sibling *helper* twice in the same
component (once for a task's start date, once for its end), rather
than inventing a second date-editing surface.

`GanttTableTD`'s own `active` prop is documented (and its own example
uses it) for "this cell falls within the task's time span" — but its
implementation ties `active` directly to `aria-selected`/roving
`tabindex` (until 2026-10-10, when `active` stopped setting
`aria-selected`; it still sets the roving `tabindex`, so the overload
reasoning below stands), and a task's bar can span many cells at once while
roving-tabindex requires exactly one `tabindex="0"` cell grid-wide.
Reusing `active` for both meanings would put multiple cells at
`tabindex="0"` simultaneously whenever a task's bar is wider than one
column — a real accessibility regression, not a style choice. This
contract therefore keeps `active` meaning exactly what `data-grid` and
`kanban-board` already use it for (the roving-tabindex cursor) and
marks "this cell is within the task's span" with a separate
`data-in-range` attribute instead, letting the consumer's CSS render a
continuous-looking bar across cells sharing it. `GanttTableTD` itself
is not modified.

## 4. HTML

```
<div class="gantt-chart {class}">
  <GanttTable label="{label}" caption="{caption}">
    <GanttTableThead>
      <GanttTableTr>
        <GanttTableTH scope="col">{labels.taskColumnHeader}</GanttTableTH>  <!-- leading task-label column -->
        <GanttTableTH scope="col" data-today>{columnLabel(period)}</GanttTableTH>
      </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
      <GanttTableTr>
        <GanttTableTH scope="row" data-depth="{depth}">
          <button class="gantt-chart-collapse-button" aria-expanded>…</button>  <!-- only on parent rows, only if labels.collapseButton -->
          {taskLabel(task)}
        </GanttTableTH>
        <GanttTableTD data-in-range data-milestone data-today aria-describedby="{dependencySummaryId}">
          <span class="gantt-chart-bar" data-percent-complete="{n}"></span>     <!-- only in the task's own leading in-range cell -->
        </GanttTableTD>
      </GanttTableTr>
      <tr class="gantt-chart-edit-row">                            <!-- only while a task is being edited -->
        <td colspan="{columns.length + 1}">
          <DateTimePicker label="{labels.startLabel}" mode="date" bind:value />
          <DateTimePicker label="{labels.endLabel}" mode="date" bind:value />
          <button class="gantt-chart-save-button" disabled?>{labels.saveLabel}</button>  <!-- disabled while a date is empty -->
          <button class="gantt-chart-cancel-button">{labels.cancelLabel}</button>
        </td>
      </tr>
    </GanttTableTbody>
  </GanttTable>
  <p class="gantt-chart-status" aria-live="polite"></p>
</div>
```

## 5. Props

| Prop          | Type                                                   | Required | Default |
| ------------- | -------------------------------------------------------- | -------- | ------- |
| `label`       | `string`                                                   | yes      | —       |
| `range`       | `{ start: string; end: string }` (ISO dates)               | yes      | —       |
| `tasks`       | `GanttTask[]`                                              | yes      | —       |
| `caption`     | `string`                                                    | no       | —       |
| `timeUnit`    | `"day" \| "week" \| "month"`                                | no       | `"day"` |
| `today`       | `string` (ISO date)                                         | no       | — (no marker unless supplied; never computed internally, to stay SSR-safe) |
| `taskLabel`   | `(task: GanttTask) => string`                               | no       | `task.label` |
| `onTaskChange`| `(taskId: string, start: string, end: string) => void`      | no       | —       |
| `labels`      | `GanttLabels`                                               | no       | `{}`    |
| `class`       | `string`                                                    | no       | `""`    |

`GanttTask`: `id` (required), `label` (required), `start`/`end` (ISO
dates, required, inclusive; equal values mean a milestone),
`percentComplete?: number`, `parentId?: string`, `dependsOn?: string[]`
(other tasks' ids, finish-to-start).

`GanttLabels` — every field optional, but presence gates the control
it names, matching every other helper's label-gating convention:
`taskColumnHeader` (text of the leading header cell, which is otherwise
empty), `columnLabel(start, end, timeUnit)`, `editButton(task)`,
`editDialogLabel(task)`, `startLabel`/`endLabel` (passed as each
composed `DateTimePicker`'s own `label`), `dateTimePickerLabels`
(a `DateTimePickerLabels` object, reused for both composed pickers —
editing is gated on this being present, since date-time-picker itself
requires it — and on `startLabel`, `endLabel`, `saveLabel` and
`cancelLabel` too, since an edit region with an unnamed field or button
is worse than none), `saveLabel`/`cancelLabel`, `dependencySummary(predecessorLabels)`,
`dateAnnouncement(taskLabel, start, end)`, `collapseButton(task, collapsed)`
(without it no collapse button renders and every row stays expanded).

## 6. Behaviour

**Time axis.** `range`/`timeUnit` generate a fixed set of columns —
one per day, per 7-day week, or per calendar month — using epoch-day/
UTC arithmetic (never local-midnight `Date` construction, the same
civil-date rule `date-time-picker` already follows) so no column
boundary can land on the wrong day across a DST transition.
`timeUnit` is a static rendering choice the consumer sets once;
shipping an interactive control to switch it live is v2 (§9).

**Task bars.** A task's `[start, end]` range is tested for overlap
against every column; overlapping cells carry `data-in-range`. A
milestone (`start === end`) marks its one cell `data-milestone`
instead of a spanning range. `percentComplete`, when set, rides as a
plain attribute (`data-percent-complete`) on the task's own leading
in-range cell — the fill itself is the consumer's CSS.

**Row hierarchy.** `task.parentId` builds a tree, flattened for
rendering with a `depth`, exposed as `data-depth` on the row header for
the consumer's CSS to indent by — never an inline style, which the
headless rules forbid. A task whose `parentId` names no task in `tasks`
is a top-level row, not silently dropped, and a `parentId` cycle cannot
recurse forever. Every parent's effective range is computed once per
`tasks` change (`effectiveRanges`), not per row per render. A parent row's
`start`/`end` are derived (min start / max end across its descendants)
and rendered read-only — parent rows are not directly editable.
`GanttTableTH`'s own `<button class="gantt-chart-collapse-button"
aria-expanded>` toggles a parent's children; collapsing removes
descendant rows from the DOM outright, the same "remove, don't just
hide" rule `data-grid` applies to hidden columns.

**Dependencies.** `task.dependsOn` is data, not a rendered arrow: the
dependent task's row carries `aria-describedby` pointing at a
generated, visually-hidden text node built from
`labels.dependencySummary`. No dependency line is drawn — see §9 for
why.

**Date/duration edit — keyboard.** The decisive design choice,
matching `kanban-board`'s own research citation for a parallel
problem: not arrow-key-nudge-by-one-day. Enter/Space on a focused
(non-parent) row opens an inline edit region for that task with two
composed `DateTimePicker` instances (`mode="date"`) bound to local
copies of `start`/`end`, and focus moves to the start date's field;
Save calls `onTaskChange` and closes; Cancel or Escape discards (an
Escape a date picker used to close its own dialog, or to drop a pending
typed edit, is left to it). Closing either way returns focus to the
grid's tab stop on the edited task's row. A range entered end-first is
saved start-first, and Save is disabled while either date is empty. Gated
on the labels listed in §5.

**Date/duration edit — pointer.** Native HTML5 drag-and-drop resizes
or reschedules a task's bar; supplementary, never the only path, the
same relationship pointer drag has to the keyboard path in
`kanban-board`.

**Announcements.** A single `gantt-chart-status` `aria-live="polite"`
region announces successful edits via `labels.dateAnnouncement`.

**SSR.** All DOM writes inside the framework's mount/effect lifecycle;
`today` is never computed internally (a server-computed "today" and a
client-computed one can disagree across a render boundary) — no
marker renders unless the consumer supplies it.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, inherited from `GanttTable`).
Roving-tabindex focus management for body cells, matching `data-grid`
and `kanban-board` — see §3 for why `active` is scoped to the cursor
only, not doubled as the task-span marker. Row-header cells
(`GanttTableTH`, `scope="row"`) hold each task's label and, for
parents, the collapse button; they sit outside the roving-tabindex
column index, the same way `data-grid`'s toolbar controls sit outside
its own grid.

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
  column axis rather than wrapping. Focusing a cell by pointer moves the
  cursor there; when collapsing removes the row under the cursor, exactly
  one cell stays tabbable.
- §8.9 Enter/Space on a focused non-parent row opens an inline edit
  region with two composed `DateTimePicker` instances seeded from that
  task's current `start`/`end`, only when `labels.dateTimePickerLabels`
  is supplied; a parent row does not open one. Opening it moves focus to
  the start date's field.
- §8.10 Saving the edit region calls `onTaskChange` with the task's id
  and the edited `start`/`end` (start-first, whatever order they were
  entered in), then closes the region and returns focus to the grid.
- §8.11 Cancelling the edit region, by its button or by Escape, discards
  changes without calling `onTaskChange` and returns focus to the grid.
- §8.12 A pointer drag-resize/reschedule of a task's bar calls
  `onTaskChange` the same way the keyboard path does.
- §8.13 A successful edit (by either path) writes an announcement to
  `gantt-chart-status` (`aria-live="polite"`) built from
  `labels.dateAnnouncement`; no announcement fires when that label is
  absent.
- §8.14 `today`, when supplied, marks its column `data-today`; when
  omitted, no column carries it — nothing is computed internally.
- §8.15 Extra attributes spread onto the root `<div>`.
- §8.16 No hardcoded user-facing strings: every label comes from a
  prop or a `labels.*` function; a control whose label is absent (collapse,
  the edit region) does not render unnamed.
- §8.17 Row depth is `data-depth` on the row header, never an inline
  style; an orphaned `parentId` renders a top-level row; a `parentId`
  cycle does not hang.

## 9. Non-goals

Dependency-arrow rendering, virtualization, critical-path calculation,
dependency types beyond finish-to-start, interactive zoom-level
switching, weekend/holiday shading, resource/assignee columns. See §2
and [spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md)
for the reasoning behind each — in particular, the dependency-arrow
non-goal is backed by two commercial libraries' own accessibility
documentation treating it as unsolved industry-wide, not something
uniquely skipped here.

## 10. Relationship to the headless layer and other helpers

`GanttChart` composes three different dependencies in one package: the
structural `GanttTable` family (matching `data-grid`'s relationship to
`DataTable`), and `date-time-picker` used twice per edit session — the
first helper-to-helper composition used for a single feature rather
than four different pickers in a row (`picker-bar`'s shape) or one
picker inside a grid cell (`kanban-board`'s shape). Follows every
other helper's established rules: headless (no bundled CSS), SSR-safe,
i18n-clean (label-presence gates each control), Svelte-canonical-first.

## 11. Research notes — SVAR Svelte Gantt (2026-10-13)

A survey of [SVAR Svelte Gantt](https://svar.dev/svelte/gantt/) (MIT core, commercial PRO edition; v2.7–2.8 at the
time of writing) for ideas to take, adapt or decline. Ideas only: no SVAR code or markup is reused, and SVAR's
PRO features are described from its public pages and release notes. Sources:
[product page](https://svar.dev/svelte/gantt/), [v2.6 release](https://svar.dev/blog/svar-svelte-gantt-2-6-released/),
[PRO edition (v2.4)](https://svar.dev/blog/svelte-gantt-pro-2-4-released/),
[v2.5 export](https://svar.dev/blog/svelte-gantt-pro-2-5-released/),
[release notes](https://app.unpkg.com/wx-svelte-gantt@2.7.0/files/whatsnew.md),
[task types](https://docs.svar.dev/vue/gantt/guides/configuration/task_types/).

**The difference in kind.** SVAR draws a canvas-like timeline of pixel-positioned bars, with SVG dependency
arrows, and optimises for pointer use and large data (it renders only the visible tasks; a demo handles 10,000).
Lily's chart is a real `role="grid"` table whose bars are column-spanning cells, so every cell is reachable by
keyboard and every relationship is text. SVAR's public documentation says little about accessibility (the
hotkeys it lists — arrows to move the selection, Ctrl+C/X/V, Ctrl+D or Backspace to delete, Ctrl+Z/Y, all
ignored while focus is in a text field — are the extent of it), which is the gap Lily's design fills; the
ideas below are therefore filtered by "can it stay a table, with text for every fact?"

### What SVAR has that Lily's v1 does not

| SVAR feature (edition)                                                       | Lily today                                  |
| ---------------------------------------------------------------------------- | ------------------------------------------- |
| Zoom: Ctrl+wheel, `minCellWidth`/`maxCellWidth`, multi-row scales (month over day), hour/minute units | one fixed `timeUnit` (`day`/`week`/`month`) |
| Markers: holiday and custom vertical markers; working-time calendars (PRO)   | `today` only; weekend/holiday shading is a non-goal |
| Link types `e2s`, `s2s`, `s2e`, `e2e` with lag; auto-scheduling (PRO)         | finish-to-start data only; no scheduling    |
| Critical path, slack/float, constraints and deadlines (PRO)                   | non-goal                                    |
| Baselines, progress line, S-curve (PRO)                                       | `percentComplete` as a data value only      |
| Unscheduled tasks (PRO), inactive/manually scheduled tasks (PRO)              | every task needs `start`/`end`              |
| Split tasks (several segments on one row) (PRO)                               | one span per task                           |
| Rollups: children and milestones minified onto the summary bar (PRO)          | parent range derived; children not echoed   |
| Task types `task`/`summary`/`milestone` plus custom `taskTypes` with CSS ids  | milestone = zero duration; parent = summary |
| Readonly mode                                                                  | editing gated on labels only                |
| Filtering (v2.6, incl. natural-language query) and column sorting              | none                                        |
| Context menu and toolbar; tooltips on bars and links                           | none                                        |
| Undo/redo (PRO); copy task; inline cell editors; field validation              | `onTaskChange` only                         |
| Export to PDF, PNG, Excel, MS Project; MS Project import (PRO)                 | out of scope                                |
| Resource load chart, assignment, WBS codes, grouping (PRO, v2.7)               | resource columns are a non-goal             |
| Real-time multi-user editing; REST data provider                               | out of scope (no data fetching)             |

### Ideas worth taking, in the order they fit this package

**A. Small, fit the headless rules as they are**

1. **`readonly`.** A boolean that suppresses the edit button, the edit region and drag-resize while leaving
   navigation, collapse and announcements. Today the only way to get a read-only chart is to omit the edit
   labels, which is indirect.
2. **Generalise `today` into `markers`.** `markers: { date: string; kind?: string; label?: string }[]` sets
   `data-marker="{kind}"` on the matching column (and a visually-hidden or `labels`-supplied text name, so a marker
   is never colour-only, WCAG 1.4.1). `today` stays as the one-line form. Covers holidays and milestones-of-the-calendar.
3. **`isNonWorking(date) => boolean`.** A consumer callback (Lily owns no calendar and no locale) that sets
   `data-non-working` on a column, giving weekend/holiday shading its hook without a shading feature. Covers
   SVAR's working-time calendar as a rendering concern; the scheduling consequence stays the consumer's.
4. **Task `type` and a `critical`/`slack` data pass-through.** `type?: string` → `data-task-type` on the row and
   span cells (SVAR's custom task types, as a class hook). `critical?: boolean` and `slack?: number` →
   `data-critical` / `data-slack`, plus an optional `labels.criticalSummary` sentence in the same
   `aria-describedby` text as the dependencies. Lily still **computes nothing**; a pure
   `criticalPath(tasks)` could ship as a separate named export for consumers who want it (see C).
5. **Richer dependency data.** `dependsOn` accepting `string | { id: string; type?: "e2s" | "s2s" | "s2e" | "e2e"; lag?: number }`,
   still exposed as text (`dependencySummary` receives the predecessor labels and types). No arrows, no scheduling:
   the data and its text description only.
6. **Progress in the edit region.** A percent-complete field next to the two date pickers, so the one value bars
   show visually is also keyboard-editable (SVAR drags it on the bar; Lily's rule is that drag is never the only path).
7. **`hour` time unit.** SVAR gained hour/minute units in 2.2; `timeUnit` could add `"hour"` with the same
   column-per-unit model.

**B. Need a design pass first**

8. **Zoom as a controlled prop.** Interactive zoom is a v1 non-goal because it implies Ctrl+wheel and visual
   layout. The headless form is `timeUnit` bindable plus a documented rule that the consumer renders zoom
   in/out buttons (a pair of `IconButton`s) and that changing it announces through `labels.zoomAnnouncement`.
   Pairs with multi-level headers: `scales: ("day" | "week" | "month")[]` renders a month row of `colspan` header
   cells over a day row (SVAR's default two-row scale) — still one table.
9. **Unscheduled tasks.** A task without `start`/`end` renders its row with no span and an "Add dates" action that
   opens the existing edit region. Fits the a11y story better than SVAR's drag-from-grid onto the timeline.
10. **Baselines.** `baseline?: { start; end }` renders a second marked span in the same cells (`data-baseline`),
    and `labels.baselineSummary(task)` states the variance in text. Same "data flag + text" approach as dependencies.
11. **Split tasks.** `segments?: { start; end }[]` marks several disjoint spans in one row; the edit region would
    edit one segment at a time. Larger than the others because the edit surface changes.
12. **Rollups.** A collapsed summary row echoing its children's spans (`data-rollup`), so collapsing a parent does
    not lose the picture. Needs a rule for overlapping children and for the text description.
13. **Row actions via `menu-picker`.** SVAR's context menu and toolbar map onto a per-row `menu-picker` (a disclosure
    of whatever actions the app provides, already a Lily helper) rather than a new menu component — consistent with
    how `kanban-board` composes `IconButton`/`Listbox` for "Move to…".
14. **Filter and sort the rows.** `data-grid` already has both, with announcements; compose or share the logic
    rather than re-implement (SVAR added filtering in 2.6 and column sorting in 1.1).
15. **Row windowing by page.** SVAR's answer to large projects is dynamic rendering; the headless answer already in
    `data-grid` is `pageSize` with `aria-rowcount`/`aria-rowindex`, which keeps the accessibility tree truthful.

**C. Keep as non-goals (with the reason)**

- **Dependency arrows, drag-to-link, pixel-positioned bars, S-curve, progress line, resource load histogram:** all
  need layout and drawing ownership (§2). Their *data* can be exposed as text (items 4, 5, 10).
- **Auto-scheduling, constraints, deadline conflict lists, critical-path *calculation*:** scheduling algorithms
  over the consumer's data, not rendering. If wanted, ship pure functions as a separate export, never inside the component.
- **Undo/redo and copy/paste:** the consumer owns the data, so it owns history. The component can emit
  `onTaskChange` with enough to invert and document the hotkey convention (ignored in text fields), but not keep a stack.
- **Export (PDF/PNG/Excel/MS Project), import, real-time sync, REST provider:** data movement, which §2 excludes.
- **Resource management and WBS/grouping:** a different product surface; `data-grid` columns cover the table side.

### Notes on method

SVAR publishes no accessibility guide that could be found, and its own docs host returned 404 for the
obvious accessibility path, so nothing above claims SVAR is or is not accessible beyond what its release notes and
a third-party mirror of its hotkeys page state. Before building item 8–12, re-read SVAR's current docs; the
PRO/free split changes between releases.
