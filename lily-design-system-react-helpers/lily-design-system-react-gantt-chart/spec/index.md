# GanttChart — Specification (React helper)

Canonical contract for `@lilydesignsystem/react-gantt-chart`, ported
from the canonical
[`@lilydesignsystem/svelte-gantt-chart`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/spec/index.md)
(the reference implementation; see
[spec/helpers/index.md § gantt-chart contract](../../../spec/helpers/index.md)
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
ties `active` directly to `aria-selected`/roving `tabindex="0"` — the
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
