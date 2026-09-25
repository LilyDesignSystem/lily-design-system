# CalendarView — Specification (Svelte helper)

Single source of truth for this package. Canonical spec; the other
seven catalogs port from this one. See also
[spec/helpers/index.md § calendar-view contract](../../../spec/helpers/index.md)
for the cross-catalog contract this package implements.

## 1. Purpose

A read/browse calendar surface: shows a grid of days for one of three
fixed periods — a week, a rolling four weeks, or a calendar month —
with period navigation, a view switcher, and consumer-owned event
rendering per day. It is a *viewing* helper, not a date-selection
input (`date-time-picker` already owns that) and not a date-range
picker (`CalendarRangePicker` already owns that).

## 2. Scope

In scope: period computation (week / four-week / padded month) from a
single `anchorDate`, a view switcher, previous/next/today navigation,
WAI-ARIA APG calendar keyboard navigation with roving tabindex,
consumer-supplied event placement per day cell, and one `aria-live`
status region announcing period changes.

Out of scope (§9 Non-goals): event creation/editing UI, drag-to-
reschedule, day view, agenda/list view, recurring-event expansion,
timezone conversion, virtualization, multi-calendar/resource views,
print/export.

## 3. Composition

Composes, rather than duplicates:

- `@lilydesignsystem/svelte-headless`'s `CalendarTable` family
  (`CalendarTable`, `CalendarTableHead`, `CalendarTableBody`,
  `CalendarTableRow`, `CalendarTableTH`, `CalendarTableTD`) —
  unmodified. `CalendarTableTD`'s own `selected` prop already means
  "the roving-tabindex cursor" in its own doc comment ("Uses a roving
  tabindex pattern where the selected cell receives focus") — not a
  separate date-picker-style persisted selection — so this package
  uses it exactly on-label for its own keyboard cursor, with no
  overload or workaround needed (unlike `GanttTableTD`'s `active`
  prop, which the `gantt-chart` package found genuinely overloaded).
- `@lilydesignsystem/svelte-date-time-picker`'s exported civil-date
  arithmetic — `monthMatrix`, `weekdayOf`, `isoWeek`,
  `firstDayOfWeekFor`, `addDays`, `addMonths`, `parseIsoDate`,
  `formatIsoDate` — confirmed present and reused directly rather than
  re-derived. `monthMatrix(year, month, firstDayOfWeek)` already
  returns the fixed six-row, Sunday/Monday-first-aware padded grid
  every consulted calendar library uses for month view; this package
  builds week and four-week views the same way, without padding, from
  the same `addDays`/`firstDayOfWeekFor` primitives.
- `@lilydesignsystem/svelte-date-time-picker`'s own calendar-dialog
  keyboard model (`onGridKeydown`'s `ArrowLeft`/`ArrowRight`/
  `ArrowUp`/`ArrowDown`/`Home`/`End`/`PageUp`/`PageDown` handling, and
  its `moveCursor`/`shiftMonth`/`shiftDays` re-paging logic) is the
  direct model for this package's own keyboard handling — see §6.

## 4. HTML

```html
<div class="calendar-view {class}">
  <div class="calendar-view-toolbar">
    <!-- view switcher: week / four-week / month toggle buttons, aria-pressed -->
    <!-- previous / next / today buttons -->
  </div>
  <table class="calendar-table" role="grid" aria-label="…">
    <thead class="calendar-table-thead">
      <tr class="calendar-table-tr">
        <th class="calendar-table-th" scope="col">…weekday…</th>
        <!-- × 7 -->
      </tr>
    </thead>
    <tbody class="calendar-table-tbody">
      <tr class="calendar-table-tr">
        <td class="calendar-table-td" role="gridcell" data-date="2026-01-06"
            data-outside-period aria-current="date" tabindex="0">
          <!-- day content: day number + consumer's day snippet -->
        </td>
        <!-- × 7, × 1/4/6 rows depending on view -->
      </tr>
    </tbody>
  </table>
  <div class="calendar-view-status" aria-live="polite"></div>
</div>
```

`CalendarTable`'s own root, `CalendarTableHead`/`Body`, `Row`, `TH`,
`TD` are rendered exactly as their own headless contracts specify;
`calendar-view` adds only the toolbar, the day-content composition,
and the status region around them.

## 5. Props

```ts
type CalendarView = "week" | "four-week" | "month";

type CalendarEvent = {
  id: string;
  /** Single-day events set `date`; multi-day events set `start`/`end` instead. */
  date?: string;
  start?: string;
  end?: string;
  [key: string]: unknown;
};

type CalendarViewLabels = {
  weekView?: string;
  fourWeekView?: string;
  monthView?: string;
  previous?: (view: CalendarView) => string;
  next?: (view: CalendarView) => string;
  today?: string;
  periodAnnouncement?: (view: CalendarView, start: string, end: string) => string;
  weekday?: (weekday: number) => string; // full name, 0 = Sunday
  weekdayAbbr?: (weekday: number) => string; // short form, for the <th>
  day?: (isoDate: string, weekday: number, outsidePeriod: boolean) => string; // full accessible cell name
};

type Props = {
  label: string;
  view: CalendarView; // bindable
  anchorDate: string; // bindable, ISO date the view is computed around
  events?: CalendarEvent[];
  today?: string; // ISO date; never computed internally (SSR-safe), mirrors gantt-chart's own `today` prop
  locale?: string; // BCP 47, passed to firstDayOfWeekFor
  labels?: CalendarViewLabels;
  onNavigate?: (view: CalendarView, anchorStart: string, anchorEnd: string) => void;
  onDayClick?: (isoDate: string) => void;
  onEventClick?: (event: CalendarEvent) => void;
  class?: string;
  day?: Snippet<[{ date: string; events: CalendarEvent[]; isToday: boolean; outsidePeriod: boolean }]>;
  [key: string]: unknown;
};
```

Every label prop gates the control it names, per the project-wide
label-presence-gates-control convention (`share-picker`'s
`copyLabel`, `date-time-picker`'s `labels`): the view switcher renders
only the buttons whose own `*View` label is supplied, and the status
region only announces when `periodAnnouncement` is supplied.

## 6. Behaviour

### 6.1 Period computation

- **Week**: exactly 7 days, `[weekStart(anchorDate), weekStart + 6]`,
  where `weekStart(date, fdow) = addDays(date, -((weekdayOf(date) -
  fdow + 7) % 7))`.
- **Four-week**: exactly 28 days, `[weekStart(anchorDate), weekStart +
  27]` — the same week-start anchor as the week view, just four rows
  instead of one. A rolling near-term window, not aligned to a
  calendar-month or fixed 4-week-from-epoch grid.
- **Month**: `monthMatrix(year, month, firstDayOfWeek)` verbatim — a
  fixed 6×7 grid, leading/trailing days from adjacent months marked
  `data-outside-period`.

### 6.2 Navigation

- **Previous / Next** step by the current view's own length: −/+7 days
  (week), −/+28 days (four-week), −/+1 month via `addMonths` on the
  1st of the anchor month, clamped (month).
- **Today** sets `anchorDate` to the `today` prop, unchanged view.
  Renders only when `today` is supplied (no client-only "today"
  assumption — see `today` in §5).
- Every navigation calls `onNavigate(view, start, end)` and updates
  the status region via `labels.periodAnnouncement`.

### 6.3 Keyboard (roving tabindex over `CalendarTableTD`'s `selected` prop)

Mirrors `date-time-picker`'s own `onGridKeydown` exactly, generalised
from one month to all three views:

| Key | Effect |
| --- | --- |
| `ArrowLeft` / `ArrowRight` | Move cursor ±1 day |
| `ArrowUp` / `ArrowDown` | Move cursor ±1 week (±7 days) |
| `Home` / `End` | Jump to the first/last day of the cursor's own row |
| `PageUp` / `PageDown` | Step the cursor by the current view's own length (mirrors §6.2) |
| `Enter` / `Space` | Fire `onDayClick(cursor)` |

When the moved-to cursor date falls outside the currently visible
days, the view re-pages to make it visible again — for week/four-week,
by stepping the window by whole weeks until the cursor is inside it;
for month, whenever the cursor's own year/month differs from the
anchor's, exactly mirroring `date-time-picker`'s `moveCursor`/
`shiftMonth`/`shiftDays` (a cursor landing on an already-rendered
padding cell from the adjacent month still re-pages, carrying that
month in as the new anchor — the same behaviour a date-time-picker
user sees paging across a month boundary with arrow keys). Focus
follows the cursor via `[data-date="…"]` lookup + `queueMicrotask`,
the same technique `date-time-picker` uses to focus a cell that did
not exist in the DOM until the re-page's own re-render lands.

### 6.4 Events

`events` are matched to the day(s) they fall on (`date`, or every day
in `[start, end]` inclusive for multi-day events) and passed to the
`day` snippet for that cell — `calendar-view` owns placement only,
never visual event-card design (see §9).

## 7. Accessibility

- WAI-ARIA APG Grid pattern via `CalendarTable`'s own `role="grid"`.
- Roving tabindex via `CalendarTableTD`'s `selected` prop — one cell
  `tabindex="0"` at a time.
- Every cell's accessible name comes from `labels.day` (e.g. "11,
  Tuesday, 6 January 2026") — a full, unambiguous name per cell,
  never a bare day number, per the accessibility research cited in
  spec/helpers/index.md § calendar-view contract.
- `aria-current="date"` on the day matching `today`.
- View-switcher buttons carry `aria-pressed` (or `aria-selected` for a
  tablist rendering) reflecting the active view.
- One `calendar-view-status` `aria-live="polite"` region announces
  every navigation via `labels.periodAnnouncement`.

## 8. Acceptance criteria

Each clause below gets one or more tests in `CalendarView.test.ts`.

- §8.1 Renders `.calendar-view` wrapping a `role="grid"` table labelled by `label`.
- §8.2 `view="week"` renders exactly 7 day cells, none `data-outside-period`.
- §8.3 `view="four-week"` renders exactly 28 day cells (4 rows), none `data-outside-period`.
- §8.4 `view="month"` renders exactly 42 day cells (6 rows); leading/trailing days from adjacent months carry `data-outside-period`.
- §8.5 The day matching `today` carries `aria-current="date"`.
- §8.6 Previous/Next step by the view's own length and call `onNavigate` with the new period's start/end.
- §8.7 Today (when `labels.today` is supplied) sets `anchorDate` to the `today` prop without changing `view`.
- §8.8 The view switcher renders only the buttons whose label is supplied, and marks the active one `aria-pressed="true"`.
- §8.9 Exactly one day cell carries `tabindex="0"` at a time; arrow keys move it by day/week; `Home`/`End` clamp to the focused row.
- §8.10 `PageUp`/`PageDown` step the cursor by the view's own length and re-page when the new cursor falls outside the visible days.
- §8.11 `Enter`/`Space` on the focused cell calls `onDayClick` with that cell's date.
- §8.12 A single-day event (`date`) renders inside exactly one day's snippet slot; a multi-day event (`start`/`end`) renders inside every day in that inclusive range.
- §8.13 Every navigation announces the new period via the `calendar-view-status` region, built from `labels.periodAnnouncement`.
- §8.14 `locale` changes the computed week start (`firstDayOfWeekFor`) and therefore which day each view starts on.
- §8.15 Omitting `today` renders no `aria-current="date"` anywhere and disables the Today button.
- §8.16 Extra attributes spread onto the root.

## 9. Non-goals

- **Event creation/editing UI** — a viewing helper; a consumer wires
  its own form/dialog to `onDayClick`/`onEventClick`.
- **Drag-to-reschedule events** — real interaction ownership, the same
  objection class `gantt-chart` raises against dependency-arrow
  rendering.
- **Day view and agenda/list view** — out of the v1 request; natural
  v2 candidates.
- **Recurring-event expansion** — a consumer data-layer concern.
- **Timezone conversion** — `events` carry ISO civil dates, the same
  convention `gantt-chart` and `date-time-picker` both use.
- **Virtualization** for very-long per-day event lists, **multi-
  calendar/resource views**, **print/export** — deferred, same
  reasoning class as every prior grid helper's own non-goals list.

## 10. Relationship to the headless layer and other helpers

`calendar-view` is the fourth helper to compose a headless `*Table`
grid family (after `data-grid`, `kanban-board`, `gantt-chart`) and the
third to depend on the sibling helper `date-time-picker` (after
`picker-bar` and `gantt-chart`) — for civil-date arithmetic and its
proven WAI-ARIA APG calendar keyboard model, not for any UI it
renders. `CalendarTable` itself is not modified.
