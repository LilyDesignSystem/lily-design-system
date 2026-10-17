# GanttChart — Specification (Web Components helper)

Canonical contract for `@lilydesignsystem/web-components-gantt-chart`,
registered as `<lily-gantt-chart>`. Ports
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-gantt-chart/spec/index.md)
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
[spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md).

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
in its §3 — the roving-tabindex cursor (`tabindex`; never `aria-selected`) and
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
          <th class="gantt-chart-row-header" scope="row" data-depth="{depth}">
            <button class="gantt-chart-collapse-button" aria-expanded aria-label="{labels.collapseButton(task,collapsed)}">▾</button> <!-- only on parent rows -->
            {taskLabel(task)}
            <span class="gantt-chart-dependency-summary" id="{dependencyId}" hidden>{labels.dependencySummary(preds)}</span> <!-- only when deps exist and the label is set -->
          </th>
          <td class="gantt-chart-td" role="gridcell" data-row data-col tabindex data-in-range data-milestone data-today aria-describedby="{dependencyId}">
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
rendering with a `depth`, exposed as `data-depth` on the row header for
the consumer's CSS to indent by (never an inline style). A parent row's `start`/`end` are derived
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
and
[spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md).

## 10. Relationship to the headless layer and other helpers

`GanttChart` composes three different dependencies in one package: the
structural `<lily-gantt-table>` (matching `kanban-board`'s relationship
to `<lily-kanban-table>`), and `<lily-date-time-picker>` used twice per
edit session — the first Web Components helper-to-helper composition
used for a single feature, mirroring `picker-bar.ts`'s dependency
pattern for a sibling helper (not headless). Follows every other
helper's established rules: headless (no bundled CSS), SSR-safe,
i18n-clean (label-presence gates each control).

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

## 18. Search (0.7.0, 2026-10-17)

Tests §18.1–§18.10. Shared across the data grid, kanban board, Gantt chart and calendar (`search-text.ts`, a pure module with its own tests: `foldText`, `searchTerms`, `matchesSearch`, `highlightSegments`).

- **Words**: a query is split on whitespace; every word must appear (AND), in any order, ignoring case and diacritics ("cafe" finds "Café"). A blank query matches everything.
- **In the Gantt chart**: `search` (a property; `labels.search` names the field) narrows the tasks. New: the Gantt had no search. Matching tasks show with their ancestors (so the hierarchy stays readable); searching ignores collapse so a match under a collapsed parent is found, and clearing the search restores it. The default text is the task label and every field's text (`searchText` replaces it). Matches in the label are wrapped in `<mark class="gantt-chart-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. `exportScope: "visible"` exports only what the search leaves.
- Highlighting uses `<mark>` only while a search is active and works on the original text (never the folded one); where folding would change a string's length it marks nothing rather than the wrong span.

## Filtering and sorting (0.7.0, 2026-10-17)

- **`filter(task)`** hides tasks it rejects; a passing task keeps its ancestors, as a search match does, and it combines with `search` (both must pass).
- **`compare(a, b)`** orders tasks among their siblings — stable, and the hierarchy is kept (a child stays under its parent). Collapse, the visible export and keyboard order all follow it.

## Export: copy to clipboard (0.7.0, 2026-10-17)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same tasks, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0, 2026-10-17)

- **PageUp / PageDown** move the cursor ten task rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next task whose label starts with them (the label is `taskLabel(task)`, ignoring case and diacritics; the same letter again steps through matches). A lone `s` stays the select shortcut; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

The matching is the pure `typeahead.ts` (`isTypeaheadKey`, `nextTypeaheadState`, `findTypeaheadMatch`), shared by the three grids and tested on its own.

## In-place edit: validation, undo and redo (0.7.0, 2026-10-17)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate, an end before the start): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(task, header, reason)` is announced, falling back to `labels.editInvalid`.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit` and the `fieldedit` event** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit` and the `fieldedit` event. `labels.undoAnnouncement(task, header, text)` / `labels.redoAnnouncement(task, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.7.0, 2026-10-17)

- **`unavailable`** is a list of dated ranges `{ start, end?, kind?, label? }` for holidays, time off and closures (`end` defaults to `start`; Lily ships no calendar, no kinds and no English). A column **every day of which is covered** gets `data-unavailable="<kinds>"` (the entries' `kind`s, `unavailable` when none, repeats removed) on its header and every cell; a column only **partly** covered gets `data-partly-unavailable` instead, so a holiday inside a week column is still marked. A `label` is rendered as text in the header (`.gantt-chart-unavailable-label`), so a day is never told apart by colour alone (WCAG 1.4.1). The weekend is `weekends`; `markers` flag one date; `isNonWorking` is a callback. Matching is the pure `unavailable.ts` (`unavailableOn`, `unavailableIn`, `unavailableKinds`), time-zone free.
- **Shading** is CSS and ships in the 57 reference themes: weekends are tinted, unavailable days are tinted *and striped*, a partly unavailable column gets a bar under its header.

## Direction and labels (0.7.0, 2026-10-17)

- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout the later date is on the left, so ArrowLeft goes to the next day, and Alt+ArrowLeft/Right shifts a task (and Alt+Shift+Arrow moves only its end) the way the arrow points. Vertical keys, Home, End, page keys and type-ahead are unchanged. `isRtl` / `logicalKey` are exported.
- **No English left over.** A complete Chinese bundle (labels, tasks, markers, unavailable days) is tested to leave no English text or `aria-label` in the DOM; every string is in `labels`.
- Tests §18.43–§18.48.
