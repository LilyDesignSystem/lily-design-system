# GanttChart — Specification (React helper)

Canonical contract for `@lilydesignsystem/react-gantt-chart`, ported
from the canonical
[`@lilydesignsystem/svelte-gantt-chart`](../../lily-design-system-svelte-gantt-chart/spec/index.md)
(the reference implementation; see
[spec/helpers/index.md § gantt-chart contract](../../spec/helpers/index.md)
for the cross-catalog contract both implement). Same behaviour, React
idioms.

## 1. Purpose

A headless control that renders a set of tasks against a time axis as
an interactive Gantt chart: task bars as column-spanning grid cells
(never pixel-positioned floating divs), keyboard-accessible date/
duration editing composed from `react-date-time-picker` (never
arrow-key drag as the only path), row hierarchy, milestones, percent-
complete, a today marker, and dependency data exposed as text. The
component owns state and behaviour; it does not own the grid's base
markup.

## 2. Scope

Same as the Svelte reference §2. In scope: rendering `tasks` against a
`range`/`timeUnit` time axis as a rectangular grid, pointer drag-to-
resize/reschedule, a keyboard-accessible edit surface built from two
composed `DateTimePicker` instances (start, end), row hierarchy with
collapse/expand and derived parent date ranges, milestones
(zero-duration tasks), percent-complete as a data value, a today-column
data flag, finish-to-start dependency data exposed via
`aria-describedby`, APG grid roving-tabindex keyboard navigation, and
`aria-live` change announcements.

Out of scope (v1 non-goals — see §9): dependency-arrow rendering,
virtualization, critical-path calculation, dependency types beyond
finish-to-start, interactive zoom-level switching, weekend/holiday
shading, resource/assignee columns.

## 3. Composition

`GanttChart` depends on `@lilydesignsystem/react-headless`'s
`GanttTable`, `GanttTableThead`, `GanttTableTbody`, `GanttTableTr`,
`GanttTableTH`, `GanttTableTD` as a real npm dependency and renders
them unmodified — the same "depend on, don't vendor" rule
`react-kanban-board` follows for its own headless table family. It
also depends on `@lilydesignsystem/react-date-time-picker` — this
catalog's first helper to compose a sibling *helper* twice in the same
component (once for a task's start date, once for its end), mirroring
`react-picker-bar`'s cross-package dependency/build-alias pattern (see
§13).

**`GanttTableTD`'s `active` prop overload — confirmed present in this
catalog too.** Its own doc comment says `active` means "this cell
represents an active time period for the task," but its actual
implementation (`lily-design-system-react-headless/components/GanttTableTD.tsx`)
ties `active` directly to `aria-selected`/roving `tabindex="0"` (until 2026-10-10, when `active` stopped setting
`aria-selected`; it still sets the roving `tabindex`, so the overload
reasoning below stands) — the
identical overload the Svelte reference found and deliberately worked
around (see that package's CHANGELOG.md). A task's bar can span many
cells at once while roving-tabindex requires exactly one
`tabindex="0"` cell grid-wide; reusing `active` for both meanings would
put multiple cells at `tabindex="0"` simultaneously whenever a task's
bar is wider than one column — a real accessibility regression, not a
style choice. This contract therefore resolves it exactly the way the
Svelte reference did: `active` here means only the roving-tabindex
cursor (matching `react-kanban-board`'s own use of `KanbanTableTD`'s
`active`), and "this cell is within the task's span" is marked with a
separate `data-in-range` attribute instead. `GanttTableTD` itself is
not modified.

## 4. HTML

```
<div class="gantt-chart {className}">
  <GanttTable label="{label}" caption="{caption}">
    <GanttTableThead>
      <GanttTableTr>
        <GanttTableTH scope="col"></GanttTableTH>                 <!-- leading task-label column -->
        <GanttTableTH scope="col" data-today>{columnLabel(period)}</GanttTableTH>
      </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
      <GanttTableTr>
        <GanttTableTH scope="row">
          <button class="gantt-chart-collapse-button" aria-expanded>…</button>  <!-- only on parent rows -->
          {taskLabel(task)}
        </GanttTableTH>
        <GanttTableTD data-in-range data-milestone data-today aria-describedby="{dependencySummaryId}">
          <span class="gantt-chart-bar" data-percent-complete="{n}"></span>     <!-- only in the task's own leading in-range cell -->
        </GanttTableTD>
      </GanttTableTr>
      <tr class="gantt-chart-edit-row">                            <!-- only while a task is being edited -->
        <td colSpan="{columns.length + 1}">
          <DateTimePicker label="{labels.startLabel}" labels="{labels.dateTimePickerLabels}" mode="date" value="{editStart}" onChange="{setEditStart}" />
          <DateTimePicker label="{labels.endLabel}" labels="{labels.dateTimePickerLabels}" mode="date" value="{editEnd}" onChange="{setEditEnd}" />
          <button class="gantt-chart-save-button">{labels.saveLabel}</button>
          <button class="gantt-chart-cancel-button">{labels.cancelLabel}</button>
        </td>
      </tr>
    </GanttTableTbody>
  </GanttTable>
  <p class="gantt-chart-status" aria-live="polite"></p>
</div>
```

## 5. Props

| Prop           | Type                                                   | Required | Default |
| --------------- | -------------------------------------------------------- | -------- | ------- |
| `label`         | `string`                                                   | yes      | —       |
| `range`         | `{ start: string; end: string }` (ISO dates)               | yes      | —       |
| `tasks`         | `GanttTask[]`                                              | yes      | —       |
| `caption`       | `string`                                                    | no       | —       |
| `timeUnit`      | `"day" \| "week" \| "month"`                                | no       | `"day"` |
| `today`         | `string` (ISO date)                                         | no       | — (no marker unless supplied; never computed internally, to stay SSR-safe) |
| `taskLabel`     | `(task: GanttTask) => string`                               | no       | `task.label` |
| `onTaskChange`  | `(taskId: string, start: string, end: string) => void`      | no       | —       |
| `labels`        | `GanttLabels`                                               | no       | `{}`    |
| `className`     | `string`                                                    | no       | `""`    |

Plus every other native `<div>` attribute (`Props` extends
`React.HTMLAttributes<HTMLDivElement>` minus `onChange`/`children`),
spread onto the root.

`GanttTask`: `id` (required), `label` (required), `start`/`end` (ISO
dates, required, inclusive; equal values mean a milestone),
`percentComplete?: number`, `parentId?: string`, `dependsOn?: string[]`
(other tasks' ids, finish-to-start).

`GanttLabels` — every field optional, but presence gates the control
it names, matching every other helper's label-gating convention:
`columnLabel(start, end, timeUnit)`, `editButton(task)`,
`startLabel`/`endLabel` (passed as each composed `DateTimePicker`'s own
`label`), `dateTimePickerLabels` (a `DateTimePickerLabels` object,
reused for both composed pickers — editing is gated on this being
present, since `date-time-picker` itself requires `labels`),
`saveLabel`/`cancelLabel`, `dependencySummary(predecessorLabels)`,
`dateAnnouncement(taskLabel, start, end)`, `collapseButton(task, collapsed)`.

## 6. Behaviour

Identical to the Svelte reference's §6, translated to React state
(`useState`/`useRef`/`useEffect`) instead of runes, and to controlled
`value`/`onChange` on the composed `DateTimePicker`s instead of
`bind:value`:

**Time axis.** `range`/`timeUnit` generate a fixed set of columns —
one per day, per 7-day week, or per calendar month — using
epoch-day/UTC arithmetic (never local-midnight `Date` construction).
`addDays` is reused directly from
`@lilydesignsystem/react-date-time-picker` (same UTC-epoch-day
implementation); `compareISO`, `endOfMonth`, `generateColumns`,
`flattenTasks`, and `effectiveRange` have no counterpart there and are
ported as plain, exported TypeScript functions instead (see §14).
`timeUnit` is a static rendering choice the consumer sets once;
shipping an interactive control to switch it live is v2 (§9).

**Task bars.** A task's `[start, end]` range is tested for overlap
against every column; overlapping cells carry `data-in-range`. A
milestone (`start === end`) marks its one cell `data-milestone`
instead of a spanning range. `percentComplete`, when set, rides as a
plain attribute (`data-percent-complete`) on the task's own leading
in-range cell — the fill itself is the consumer's CSS.

**Row hierarchy.** `task.parentId` builds a tree, flattened for
rendering with a `depth` used for indentation. A parent row's
`start`/`end` are derived (min start / max end across its descendants)
and rendered read-only — parent rows are not directly editable.
`GanttTableTH`'s own `<button class="gantt-chart-collapse-button"
aria-expanded>` toggles a parent's children; collapsing removes
descendant rows from the DOM outright.

**Dependencies.** `task.dependsOn` is data, not a rendered arrow: the
dependent task's row carries `aria-describedby` pointing at a
generated, visually-hidden text node built from
`labels.dependencySummary`. No dependency line is drawn — see §9.

**Date/duration edit — keyboard.** Enter/Space on a focused
(non-parent) row opens an inline edit region for that task with two
composed `DateTimePicker` instances (`mode="date"`) bound to local
`editStart`/`editEnd` state seeded from the task's own `start`/`end`;
Save calls `onTaskChange` and closes; Cancel discards. Gated on
`labels.dateTimePickerLabels` being supplied — see §5.

**Date/duration edit — pointer.** Native HTML5 drag-and-drop resizes
or reschedules a task's bar; supplementary, never the only path.

**Announcements.** A single `gantt-chart-status` `aria-live="polite"`
region announces successful edits via `labels.dateAnnouncement`.

**SSR.** All DOM writes happen inside `useEffect`; `today` is never
computed internally — no marker renders unless the consumer supplies
it.

## 7. Accessibility

Same as the Svelte reference §7: WAI-ARIA APG Grid pattern
(`role="grid"`, inherited from `GanttTable`). Roving-tabindex focus
management for body cells, matching `react-kanban-board` — see §3 for
why `active` is scoped to the cursor only, not doubled as the
task-span marker. Row-header cells (`GanttTableTH`, `scope="row"`)
hold each task's label and, for parents, the collapse button; they sit
outside the roving-tabindex column index.

## 8. Acceptance criteria

Identical to the Svelte reference's §8 clauses, renumbered here for
this package's own test file to reference directly:

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
- §8.10 Saving the edit region calls `onTaskChange` with the task's id
  and the edited `start`/`end`, then closes the region.
- §8.11 Cancelling the edit region discards changes without calling
  `onTaskChange`.
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

Same as the Svelte reference's §9: dependency-arrow rendering,
virtualization, critical-path calculation, dependency types beyond
finish-to-start, interactive zoom-level switching, weekend/holiday
shading, resource/assignee columns.

## 10. Relationship to the headless layer and other helpers

`GanttChart` composes three different dependencies in one package: the
structural `GanttTable` family (matching `react-kanban-board`'s
relationship to `KanbanTable`), and `react-date-time-picker` used
twice per edit session — this catalog's first helper-to-helper
composition used for a single feature rather than four different
pickers in a row (`react-picker-bar`'s shape) or one picker inside a
grid cell (`react-kanban-board`'s shape). Follows every other React
helper's established rules: headless (no bundled CSS), SSR-safe,
i18n-clean (label-presence gates each control), React-19-idiomatic.

## 11. Non-goals — unchanged

See §9.

## 12. Differences from the Svelte reference

- `value`/state is `useState`, not `$state` runes; no two-way binding
  — the two composed `DateTimePicker` instances use controlled
  `value`/`onChange` (`editStart`/`editEnd` local state) instead of
  `bind:value`.
- `class` is `className`.
- No `nextGanttChartId()` module-level counter: `React.useId()`
  supplies a stable, hydration-safe id per instance instead.
- Extra attributes are typed via `Omit<React.HTMLAttributes<HTMLDivElement>, ...>`
  rather than a `[key: string]: unknown` index signature.
- `addDays` is imported from `@lilydesignsystem/react-date-time-picker`
  rather than re-derived — see §13.

## 13. Cross-package build/alias pattern

Mirrors `@lilydesignsystem/react-picker-bar`'s own pattern for
depending on sibling packages inside this catalog, which has no pnpm
workspace linking (no `packages:` glob in `pnpm-workspace.yaml`):

- `package.json` declares `@lilydesignsystem/react-date-time-picker` as
  a real `dependencies` entry (resolved from the registry once
  published), the same as `react-headless`.
- The workspace-root `vite.config.ts` gets a `resolve.alias` entry
  pointing the bare `@lilydesignsystem/react-date-time-picker`
  specifier at that sibling's already-built
  `lily-design-system-react-date-time-picker/dist/index.js`, for local
  dev/test only — not read by the `build.js` tsup build, which keeps
  the bare import for a real install to resolve.
- The workspace-root `tsconfig.json` gets a matching `paths` entry to
  `dist/index.d.ts`, so this package's own `--dts` build can resolve
  the sibling's type declarations.
- `build.js` needs no change: it already discovers every
  `lily-design-system-react-*` directory with an `index.ts` and passes
  each one's `package.json#name` as `--external` to every package's
  build, so `@lilydesignsystem/react-date-time-picker` is externalized
  automatically. Alphabetically, `…-date-time-picker` already sorts
  before `…-gantt-chart`, so date-time-picker's `dist/` (and its type
  declarations) exist by the time this package's own `--dts` build
  runs — no `picker-bar`-style manual sort exception needed.

## 14. Pure helper exports

`compareISO`, `endOfMonth`, `generateColumns`, `flattenTasks`,
`effectiveRange` are exported from `GanttChart.tsx` and the barrel,
mirroring the Svelte reference's own exports, because they are
independently useful and independently testable. `addDays` is
re-exported from `@lilydesignsystem/react-date-time-picker` directly
(not re-implemented) — import it from there, not from this package.

## Svelte 0.2.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§12 there): `readonly`, `markers` (`data-marker` plus a text label), `isNonWorking` (`data-non-working` when every day in a column is non-working), and task `type`/`critical`/`slack` as `data-*` hooks on the row.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there): the progress field (`labels.percentLabel`, a 4th `onTaskChange` argument), baselines (`task.baseline`, `data-baseline`, `labels.baselineSummary`) and typed dependencies (`dependsOn` objects, `labels.dependencyDetail`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §14.1–§14.17): zoom (`timeUnit`, `labels.zoomIn` / `zoomOut`), drag-resize handles, task selection (`selectedTaskId`, `onTaskSelect`, the `s` key), Alt+ArrowLeft/Right shift and Alt+Shift+Arrow end move, and `taskAttrs`.

## Unscheduled tasks and collapse-all (2026-10-16)

Ported from the Svelte canonical (its spec "Unscheduled tasks and collapse-all", tests §14.18–§14.24). `start` / `end` are optional on a task: with neither, the row renders no bar and no `data-in-range` cells and carries `data-unscheduled`; the edit region opens with empty dates and Save is disabled until both are set. `effectiveRanges` skips an unscheduled child when deriving a parent's span (a parent whose children are all unscheduled has an empty range and is unscheduled itself). Drag, resize and Alt+Arrow ignore an unscheduled task, and a baseline variance with no current end is 0. `collapsedTaskIds` holds the collapsed parent ids; `labels.expandAll` / `labels.collapseAll` gate two buttons in `.gantt-chart-collapse-all` (shown only when the chart has parents), each disabled when it would change nothing.

## 15. Typed fields, inline editing, export, virtualization (0.5.0, 2026-10-16)

Tests §14.25–§14.40. The data grid's cell types, export and windowing, applied to tasks.

- **Typed fields**: `fields` is a list of `{ id, header, type?, options?, numberFormat?, dateFormat?, parse?, exportValue?, exportable?, editable?, editLabel? }`, read from `task.values[id]`.
  Each is a column (`th scope="col"` plus a `GanttTableTD` per row, `data-field`, `data-type`) between the task name and the timeline. `type` is a data-grid cell type; `resolveColumn` fills in the
  type's `format`, `compare` and `exportValue`, once per `fields` / `locale` change. With no `locale` a value shows as stored. The field cells carry no `data-row` / `data-col`, so the roving timeline grid is unchanged.
- **Inline editing**: `onFieldEdit({ taskId, fieldId, value, previous })` turns it on (and not `readonly`, not `editable: false`). `text`, `number`, `link`, `date`, `time`, `select` and `radio` fields edit; the others
  display and export only. The value becomes a `.gantt-chart-field-button` (`tabindex="-1"`, named by the header plus the value); clicking it, or **F2** on a timeline cell (first editable field of the row), opens
  `.gantt-chart-field-editor` (an `<input>` of the type, or a `<select>` of `options`). **Enter** commits, **Escape** cancels, blur commits, **Tab** / **Shift+Tab** commit and move to the row's next / previous editable field.
  The editor owns its keys, and while an IME is composing (`isComposing`, or `keyCode` 229) Enter, Escape and Tab belong to the IME. A value that does not fit the type is refused (the editor stays open,
  `labels.editInvalid`); an unchanged value reports nothing; `labels.editAnnouncement(task, header, text)`. Parent tasks' fields are their own data and edit like any other.
- **Export**: `labels.exportCsv` / `exportTsv` / `exportExcel` each gate a `.gantt-chart-export-button` (`data-gantt-export-format`) in a `.gantt-chart-export` group named by `labels.export`; none renders without
  `labels.exportHeaders`. One row per task in tree order: task label, start, end (a parent's derived span; real dates in Excel, empty for an unscheduled task), then — each only when its header is named — percent
  complete, parent label, predecessors (`; ` joined), baseline start and end; then every `exportable` field. `exportScope` `"all"` (default) or `"visible"` (leaves out tasks under a collapsed parent).
  Formula-looking text is defused. `onExport({ format, filename, taskCount, blob })` may return `false` to take over; otherwise the file is saved and `labels.exportAnnouncement` is announced.
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
- **In the Gantt chart**: `search` (controlled when given; `labels.search` names the field) narrows the tasks. New: the Gantt had no search. Matching tasks show with their ancestors (so the hierarchy stays readable); searching ignores collapse so a match under a collapsed parent is found, and clearing the search restores it. The default text is the task label and every field's text (`searchText` replaces it). Matches in the label are wrapped in `<mark class="gantt-chart-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. `exportScope: "visible"` exports only what the search leaves.
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
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit`. `labels.undoAnnouncement(task, header, text)` / `labels.redoAnnouncement(task, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.7.0, 2026-10-17)

- **`unavailable`** is a list of dated ranges `{ start, end?, kind?, label? }` for holidays, time off and closures (`end` defaults to `start`; Lily ships no calendar, no kinds and no English). A column **every day of which is covered** gets `data-unavailable="<kinds>"` (the entries' `kind`s, `unavailable` when none, repeats removed) on its header and every cell; a column only **partly** covered gets `data-partly-unavailable` instead, so a holiday inside a week column is still marked. A `label` is rendered as text in the header (`.gantt-chart-unavailable-label`), so a day is never told apart by colour alone (WCAG 1.4.1). The weekend is `weekends`; `markers` flag one date; `isNonWorking` is a callback. Matching is the pure `unavailable.ts` (`unavailableOn`, `unavailableIn`, `unavailableKinds`), time-zone free.
- **Shading** is CSS and ships in the 57 reference themes: weekends are tinted, unavailable days are tinted *and striped*, a partly unavailable column gets a bar under its header.

## Direction and labels (0.7.0, 2026-10-17)

- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout the later date is on the left, so ArrowLeft goes to the next day, and Alt+ArrowLeft/Right shifts a task (and Alt+Shift+Arrow moves only its end) the way the arrow points. Vertical keys, Home, End, page keys and type-ahead are unchanged. `isRtl` / `logicalKey` are exported.
- **No English left over.** A complete Chinese bundle (labels, tasks, markers, unavailable days) is tested to leave no English text or `aria-label` in the DOM; every string is in `labels`.
- Tests §18.43–§18.48.
