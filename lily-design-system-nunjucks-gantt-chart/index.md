# GanttChart (Nunjucks helper)

A reusable, headless Nunjucks 3 + vanilla-JS Gantt chart: task bars as
column-spanning grid cells (never pixel-positioned floating divs),
row hierarchy with collapse/expand, milestones, percent-complete, a
today marker, finish-to-start dependency data exposed as text, and a
keyboard-accessible edit region composed from
`@lilydesignsystem/nunjucks-date-time-picker` — never drag-only.

The single source of truth is [spec/index.md](./spec/index.md). This
file is the user guide. For topic deep-dives see [docs/](./docs/) and
for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [How the pieces fit — and the one architectural gotcha](#how-the-pieces-fit--and-the-one-architectural-gotcha)
- [Install](#install)
- [Quick start](#quick-start)
- [Macro parameters](#macro-parameters)
- [Client.js API](#clientjs-api)
- [Row hierarchy](#row-hierarchy)
- [Editing a task's dates](#editing-a-tasks-dates)
- [Dependencies](#dependencies)
- [Accessibility](#accessibility)
- [Styling](#styling)
- [SSR and the first paint](#ssr-and-the-first-paint)
- [Testing](#testing)

## Why this exists

A Gantt chart is a grid whose every cell depends on real calendar
arithmetic (which day does column 14 fall on when the range starts on
a Tuesday in a leap year?) and whose primary interaction — rescheduling
a task — is usually shipped as drag-only, locking out anyone who can't
drag (WCAG 2.5.7). This helper renders task bars as ordinary
column-spanning table cells rather than floating, pixel-positioned
divs, and makes a keyboard-accessible edit region (two date pickers,
Save/Cancel) the PRIMARY way to reschedule a task, with drag as a
supplementary convenience.

The helper is a port of the Svelte canonical
`@lilydesignsystem/svelte-gantt-chart`. See
[spec/index.md §4](./spec/index.md#4-macro-parameters-and-nunjucks-deviations)
for every documented prop deviation a Nunjucks macro's inability to
evaluate a callback requires.

## How the pieces fit — and the one architectural gotcha

Like every helper in this catalog, this is a **macro + client.js**
pair — but unlike the others, the split here is unusually deep:
**`gantt-chart.client.js` builds the entire time-axis header and every
grid-body cell**, not just the interactive behaviour. Generating
`range`/`timeUnit` into a list of day/week/month columns needs real
civil-date arithmetic (days-in-month, leap years) that a Nunjucks
template cannot do at all — see
[spec/index.md §3](./spec/index.md#3-composition-and-why-the-grid-body-is-entirely-client-built)
for the full reasoning, which mirrors `date-time-picker.njk`'s own
documented calendar-grid split.

```
Nunjucks render time                     │  Browser runtime
                                          │
{{ ganttChart({…}) }}                     │  import { autoInit } from
   │                                      │    "./gantt-chart.client.js";
   ▼                                      │  autoInit({ onTaskChange, labels });
<div data-lily-gantt-chart-root           │     │
     data-lily-gantt-chart-range-start    │     ▼
     data-lily-gantt-chart-range-end      │  generateColumns(range, timeUnit)
     data-lily-gantt-chart-time-unit>     │     │
  <table role="grid">                     │     ▼
    <thead>… leading <th> only …</thead>  │  appends one <th> per column
    <tbody>                               │     │
      <tr data-lily-gantt-chart-start     │     ▼
          data-lily-gantt-chart-end>      │  appends one <td> per row per
        <th>task label, collapse…</th>    │  column: data-in-range,
      </tr>                               │  data-milestone, data-today,
      <tr class="gantt-chart-edit-row"    │  the task bar
          hidden>… 2 date pickers …</tr>  │
    </tbody>                              │
  </table>                                │
  <p aria-live="polite"></p>              │
</div>                                    │
```

**What this means practically**: a no-JS page shows every task's row
and label, but no dates, no bars, and no way to edit or reschedule
anything — the chart is entirely inert until `gantt-chart.client.js`
runs. Row hierarchy, though, IS fully server-rendered (a `parentId`
tree walk needs no calendar arithmetic), and so is each row's own
derived date range for parent tasks — see
[Row hierarchy](#row-hierarchy) below.

## Typed fields, editing and export

- **Typed fields and editing** (0.5.0): `fields` + `task.values` add typed columns; `editableFields` edits them in place (click, F2, Tab). See [spec §11](./spec/index.md#11-typed-fields-inline-editing-export-virtualization-050-2026-10-16).
- **Export and virtualization** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons; `virtualize` windows long task lists.

## Install

| File | Purpose |
| --- | --- |
| `gantt-chart.njk` | The Nunjucks macro. |
| `gantt-chart.client.js` | The ES-module runtime — builds the time axis and grid. |
| `spec/index.md` / `index.md` | Documentation. |

Runtime dependencies: `nunjucks` ≥ 3 server-side; standard DOM APIs
client-side. `@lilydesignsystem/nunjucks-headless` (gantt-table macro
family) and `@lilydesignsystem/nunjucks-date-time-picker` (composed
twice per edit session) are real npm `dependencies` of this package.

## Quick start

```njk
{% from "@lilydesignsystem/nunjucks-gantt-chart/template" import ganttChart %}

{{ ganttChart({
  label: "Q4 plan",
  range: { start: "2026-10-01", end: "2026-10-31" },
  tasks: [
    { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-03" },
    { id: "build", label: "Build", start: "2026-10-04", end: "2026-10-08", dependsOn: ["design"], percentComplete: 40 },
    { id: "launch", label: "Launch", start: "2026-10-09", end: "2026-10-09" }
  ],
  labels: {
    saveLabel: "Save",
    cancelLabel: "Cancel",
    startLabel: "Start date",
    endLabel: "End date",
    dependencySummary: "Blocked by: {predecessors}",
    collapseLabel: "Collapse {task}",
    expandLabel: "Expand {task}",
    dateTimePickerLabels: {
      previousYear: "Previous year", previousMonth: "Previous month",
      previousWeek: "Previous week", previousDay: "Previous day",
      nextDay: "Next day", nextWeek: "Next week",
      nextMonth: "Next month", nextYear: "Next year",
      confirm: "Confirm", cancel: "Cancel"
    }
  }
}) }}
```

```html
<script type="module">
  import { autoInit } from "@lilydesignsystem/nunjucks-gantt-chart";

  autoInit({
    onTaskChange(taskId, start, end) {
      // persist the reschedule — an API call, a form submit, whatever your app does
    },
    labels: {
      columnLabel: (start) => start, // or format however you like
      dateAnnouncement: (taskLabel, start, end) => `${taskLabel} moved to ${start} – ${end}`,
    },
  });
</script>
```

## Macro parameters

Full table, and every Svelte-prop-to-Nunjucks deviation, in
[spec/index.md §4](./spec/index.md#4-macro-parameters-and-nunjucks-deviations).
Required: `label`, `range`, `tasks`. Optional: `caption`, `timeUnit`
(`"day"` default), `today`, `labels`, `name`, `id`, `classes`,
`attributes`.

Two labels are notably NOT macro params, unlike every other helper's
`labels.*` fields — `columnLabel` and `dateAnnouncement` stay real
functions passed only to `initGanttChart`/`autoInit`, because neither
column headers nor a completed edit exist until after hydration. See
the deviation table linked above.

## Client.js API

```js
import {
  initGanttChart,
  autoInit,
  compareISO,
  endOfMonth,
  generateColumns,
  rangesOverlap,
} from "@lilydesignsystem/nunjucks-gantt-chart";
```

- `autoInit(opts?)` — find every `[data-lily-gantt-chart-root]` on the
  page and wire it.
- `initGanttChart(root, opts?)` — wire a single root `<div>`; builds
  the time-axis header and every grid cell, and returns `{ destroy }`.
- `compareISO`, `endOfMonth`, `generateColumns`, `rangesOverlap` — the
  pure date-math/column-generation helpers, exported for direct use
  and testing (mirrors the Svelte canonical's own exported utilities).

`opts`:

- `onTaskChange(taskId, start, end)` — called after every successful
  edit, by either path.
- `labels.columnLabel(start, end, timeUnit)` — formats a column
  header; defaults to the column's own `start` when absent.
- `labels.dateAnnouncement(taskLabel, start, end)` — builds the
  `aria-live` announcement text; absent means no announcement fires.

## Row hierarchy

`task.parentId` builds the row tree entirely SERVER-SIDE — depth,
whether a row has children, and (for a parent) its DERIVED `start`/
`end` (the min start / max end across all its descendants,
recursively) are all resolved by `gantt-chart.njk` and baked onto each
row as data attributes. A parent row is never itself directly
editable — no edit region is ever rendered for it.

Clicking (or activating) a parent's collapse button removes every
descendant row — and that descendant's own edit row, if any — from
the DOM outright, and restores them, in original order, on expand.
`gantt-chart.client.js` never re-walks the task tree to do this: a
row's descendants are always the contiguous run of next-siblings whose
own depth exceeds its own, a direct consequence of the server's
depth-first render order.

## Editing a task's dates

Enter/Space on a focused non-parent row's grid cell opens that row's
own (always-rendered, hidden) inline edit region: two composed
`DateTimePicker` instances, `mode="date"`, pre-seeded with the task's
current `start`/`end`. Save calls `onTaskChange`; Cancel discards.

Every open re-initialises both date pickers fresh and destroys them on
close — `date-time-picker.client.js` has no imperative "reset" call,
so this is how a cancelled or re-opened edit always starts from the
task's own real dates rather than a stale typed value from a previous
session.

Editing is entirely gated on `labels.dateTimePickerLabels` being
supplied: when it's absent, no edit row is rendered anywhere in the
chart, matching `date-time-picker`'s own "labels are required"
contract.

## Dependencies

`task.dependsOn` (an array of other tasks' ids) is resolved to those
tasks' own labels SERVER-SIDE and rendered as a visually-hidden
summary text in the row's own header cell, built from
`labels.dependencySummary`. Every body cell in that row carries
`aria-describedby` pointing at it. No dependency arrow is ever drawn —
see [spec/index.md §9](./spec/index.md#9-acceptance-criteria) and
`spec/helpers/index.md`'s gantt-chart contract for why: two commercial
Gantt libraries' own accessibility documentation treat rendering an
accessible dependency line as unsolved industry-wide.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, set explicitly by this
  macro).
- Roving tabindex for the grid, scoped to the current visible row list
  (collapse/expand changes it).
- Editing via composed `DateTimePicker` is the accessible path for
  rescheduling; drag is supplementary, never required.
- One `aria-live="polite"` region for every edit announcement.

### Weekend shading and dependency arrows (0.6.0)

- **`weekends`** (weekdays, 0 = Sunday … 6 = Saturday, never defaulted) marks day columns `data-weekend` on the header and every cell; the 57 `themes/` tint them. Week and month columns are not marked.
- **`dependencyArrows`** draws an `aria-hidden` SVG arrow (`.gantt-chart-dependency-arrow`, `data-from`, `data-to`, `data-dependency-type`) per dependency by its type (`e2s`, `s2s`, `s2e`, `e2e`), measured from the rendered cells; the text description (`labels.dependencySummary`) remains. See spec §17.

## Keyboard

| Key | Where | Action |
| --- | --- | --- |
| `Arrow` keys | Grid cell | Move the roving-tabindex cursor; clamp at the current grid's edges. |
| `Home` / `End` | Grid cell | Jump to the first/last column of the current row. |
| `Ctrl+Home` / `Ctrl+End` | Grid cell | Jump to the grid's first/last cell. |
| `Enter` / `Space` | Grid cell (non-parent row) | Open that row's edit region. |
| — | Grid cell (parent row) | Does nothing — parent rows are never directly editable. |

## Styling

Ships no CSS. Class hooks: `.gantt-chart` (root), `.gantt-chart-bar`,
`.gantt-chart-collapse-button`, `.gantt-chart-dependency-summary`,
`.gantt-chart-edit-row`, `.gantt-chart-save-button`,
`.gantt-chart-cancel-button`, `.gantt-chart-status`, plus every
`.gantt-table*` class from the composed headless macro family and
every `.date-time-picker*` class from the two composed date pickers.

## SSR and the first paint

The macro is pure. It renders every row's structure (label, collapse
button, dependency summary, the two composed date pickers per
editable row) but NO date columns and NO grid cells — see
[How the pieces fit](#how-the-pieces-fit--and-the-one-architectural-gotcha)
above for why. **The chart shows no dates or bars at all until
`gantt-chart.client.js` runs.** This is a real, deliberate, documented
trade-off — the same one `date-time-picker.njk` already accepts for
its own calendar grid — not an oversight.

## Testing

`vitest` under a jsdom environment exercises every §9 acceptance
clause in [spec/index.md §9](./spec/index.md#9-acceptance-criteria),
plus dedicated regression tests for the edit-region reset-on-reopen
behaviour and the collapse/expand DOM-removal mechanics described in
[spec/index.md §7](./spec/index.md#7-behaviour).

## Files in this directory

| File | Purpose |
| --- | --- |
| `spec/index.md` | Single source of truth — API, behaviour, tests. |
| `AGENTS.md` | Fast-index pointer. |
| `gantt-chart.njk` | The macro. |
| `gantt-chart.client.js` | The ES-module runtime. |
| `gantt-chart.test.ts` | vitest suite covering every spec §9 item. |
| `index.md` | This file. |
| `docs/` | Deep-dive topic guides. |
| `examples/` | Runnable Nunjucks templates. |
| `CHANGELOG.md` | Version history. |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.

  text summary; with `dependencyArrows` an `aria-hidden` SVG overlay also draws an arrow per dependency (0.6.0), so the text stays the accessible description.
## Filtering and sorting (0.7.0)

- **`filter(task)`** hides tasks it rejects; a passing task keeps its ancestors, as a search match does, and it combines with `search` (both must pass).
- **`compare(a, b)`** orders tasks among their siblings — stable, and the hierarchy is kept (a child stays under its parent). Collapse, the visible export and keyboard order all follow it.

## Export: copy to clipboard (0.7.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same tasks, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and the client option `onCopy({ text, rowCount })` (and the `copy` event) may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0)

- **PageUp / PageDown** move the cursor ten task rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next task whose label starts with them (the label is `taskLabel(task)`, ignoring case and diacritics; the same letter again steps through matches). A lone `s` stays the select shortcut; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

## In-place edit: validation, undo and redo (0.7.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate, an end before the start): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(task, header, reason)` is announced, falling back to `labels.editInvalid`.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit`. `labels.undoAnnouncement(task, header, text)` / `labels.redoAnnouncement(task, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.7.0)

- **`unavailable`** is a list of dated ranges `{ start, end?, kind?, label? }` for holidays, time off and closures (`end` defaults to `start`; Lily ships no calendar, no kinds and no English). A column **every day of which is covered** gets `data-unavailable="<kinds>"` (the entries' `kind`s, `unavailable` when none, repeats removed) on its header and every cell; a column only **partly** covered gets `data-partly-unavailable` instead, so a holiday inside a week column is still marked. A `label` is rendered as text in the header (`.gantt-chart-unavailable-label`), so a day is never told apart by colour alone (WCAG 1.4.1). The weekend is `weekends`; `markers` flag one date; `isNonWorking` is a callback. Matching is the pure `unavailable.ts` (`unavailableOn`, `unavailableIn`, `unavailableKinds`), time-zone free.
- **Shading** is CSS and ships in the 57 reference themes: weekends are tinted, unavailable days are tinted *and striped*, a partly unavailable column gets a bar under its header.

## Direction and labels (0.7.0)

- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout the later date is on the left, so ArrowLeft goes to the next day, and Alt+ArrowLeft/Right shifts a task (and Alt+Shift+Arrow moves only its end) the way the arrow points. Vertical keys, Home, End, page keys and type-ahead are unchanged. `isRtl` / `logicalKey` are exported.
- **No English left over.** A complete Chinese bundle (labels, tasks, markers, unavailable days) is tested to leave no English text or `aria-label` in the DOM; every string is in `labels`.
- Tests §18.43–§18.48.

## Search (0.7.0)

`search` (a macro param; the field renders when `labels.search` names it) narrows the tasks: every word must appear, in any order, ignoring case and diacritics. New: the Gantt had no search. Matching tasks show with their ancestors (so the hierarchy stays readable); searching ignores collapse so a match under a collapsed parent is found, and clearing the search restores it. The default text is the task label and every field's text (`searchText` replaces it). Matches in the label are wrapped in `<mark class="gantt-chart-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. `exportScope: "visible"` exports only what the search leaves. See spec §18.

Critical-path calculation, interactive zoom-level
switching, holiday shading from a calendar (`isNonWorking` marks them; `weekends` marks weekdays), resource/assignee columns. See
