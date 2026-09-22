# `<gantt-chart>` — Specification

Single source of truth for the `@lilydesignsystem/html-gantt-chart` HTML
helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

Ported from the canonical Svelte helper
[`@lilydesignsystem/svelte-gantt-chart`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart/spec/index.md).
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
          <th class="gantt-table-th" scope="row" style="padding-inline-start: {depth}em">
            <button class="gantt-chart-collapse-button" aria-expanded="true|false">…</button>  <!-- only on parent rows -->
            {taskLabel(task)}
            <span class="gantt-chart-dependency-summary" hidden>{dependencySummary}</span>     <!-- only when deps + label -->
          </th>
          <td class="gantt-table-td" data-row="{r}" data-col="{c}" tabindex="0|-1" aria-selected="true|false"
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

## 9. Non-goals

Dependency-arrow rendering, virtualization, critical-path calculation,
dependency types beyond finish-to-start, interactive zoom-level
switching, weekend/holiday shading, resource/assignee columns. See §2
and [spec/helpers/index.md § gantt-chart contract](../../../spec/helpers/index.md).

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
   wired to `aria-selected`/`tabindex` in that catalog. This catalog's
   `gantt-table-td.html` contract documents only `aria-label` — there is
   no `active` prop to begin with, so this port sets `tabindex`/
   `aria-selected` (roving cursor) and `data-in-range` (span membership)
   as two independent, always-compatible attributes with no risk to
   document a workaround for.

5. **§8.15 "extra attributes spread onto the root" is re-scoped** —
   identical reasoning to `kanban-board`'s spec §10.4.

6. **`taskchange` event.** Not present in the Svelte canonical (which
   uses only the `onTaskChange` prop). Added to match this catalog's
   callback/event pairing convention.

## 11. Tracking

- Package directory: `lily-design-system-html-helpers/lily-design-system-html-gantt-chart/`
- Spec version: 0.1.0
- Created: 2026-09-22
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;

---

Lily™ and Lily Design System™ are trademarks.
