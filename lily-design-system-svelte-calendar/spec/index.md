# CalendarView — Specification (Svelte helper)

Single source of truth for this package. Canonical spec; the other
seven catalogs port from this one. See also
[spec/helpers/index.md § calendar contract](../../spec/helpers/index.md)
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
`calendar` adds only the toolbar, the day-content composition,
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
  selectedDate?: string; // bindable; the picked day, distinct from the keyboard cursor
  minDate?: string;
  maxDate?: string;
  isDisabled?: (isoDate: string) => boolean;
  onDayClick?: (isoDate: string) => void; // enabled days only
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
| `Enter` / `Space` | Pick the cursor day: set `selectedDate`, fire `onDayClick(cursor)` (not on a disabled day) |
| `t` | Go to `today` (navigate and move the cursor); a no-op without `today` |

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
`day` snippet for that cell — `calendar` owns placement only,
never visual event-card design (see §9).

## 7. Accessibility

- WAI-ARIA APG Grid pattern via `CalendarTable`'s own `role="grid"`.
- Roving tabindex via `CalendarTableTD`'s `selected` prop — one cell
  `tabindex="0"` at a time.
- Every cell's accessible name comes from `labels.day` (e.g. "11,
  Tuesday, 6 January 2026") — a full, unambiguous name per cell,
  never a bare day number, per the accessibility research cited in
  spec/helpers/index.md § calendar contract.
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
- §8.17 Picking a day sets `data-selected` on it, separate from the keyboard cursor.
- §8.18 `minDate`, `maxDate` and `isDisabled` give days `aria-disabled`/`data-disabled`; they stay focusable but cannot be picked.
- §8.19 `t` moves the cursor to today and navigates.
- §8.20 `t` is a no-op without `today`.
- §8.21 The `day` snippet receives `selected`, `disabled` and `openEvent`, which fires `onEventClick`.

## 9. Non-goals

- **Event creation/editing UI** — a viewing helper; a consumer wires
  its own form/dialog to `onDayClick`/`onEventClick`.
- **Drag-to-reschedule events** — shipped since: `onEventMove` with
  `eventProps` (drag) and Alt+arrow (keyboard). The event element must
  be focusable for Alt+arrow to reach it (§5).
- **Day view and agenda/list view** — shipped since (day view and the
  agenda in §15).
- **Recurring-event expansion** — a consumer data-layer concern.
- **Timezone conversion** — `events` carry ISO civil dates, the same
  convention `gantt-chart` and `date-time-picker` both use.
- **Virtualization** for very-long per-day event lists, **multi-
  calendar/resource views**, **print/export** — deferred, same
  reasoning class as every prior grid helper's own non-goals list.

## 10. Relationship to the headless layer and other helpers

`calendar` is the fourth helper to compose a headless `*Table`
grid family (after `data-grid`, `kanban-board`, `gantt-chart`) and the
third to depend on the sibling helper `date-time-picker` (after
`picker-bar` and `gantt-chart`) — for civil-date arithmetic and its
proven WAI-ARIA APG calendar keyboard model, not for any UI it
renders. `CalendarTable` itself is not modified.

## 11. Research notes — making the calendar interactive (2026-10-14)

Surveyed FullCalendar, Schedule-X, and the Syncfusion, Kendo and MUI calendars.

- **Keyboard parity is the gap.** FullCalendar makes events focusable only
  with `eventInteractive`, and its docs describe no keyboard route for drag
  or resize (touch is long-press). Schedule-X resizes by dragging an edge,
  with 15/30/60-minute snapping. None documented keyboard move or resize,
  so a keyboard route for either would be new ground.
- **Grid navigation is settled.** Arrows, Home/End and PageUp/PageDown over
  a `grid` role, one tab stop, as here.

Shipped in 0.2.0: a picked day (`selectedDate`), disabled days
(`minDate`, `maxDate`, `isDisabled`), the `t` shortcut, and a working
`onEventClick` through the `day` snippet's `openEvent`.

Ideas, ranked, not yet built:

1. **Range pick**: Shift+Arrows extends a range from the picked day,
   Enter confirms with `onRangeSelect(start, end)`.
2. **Keyboard move**: focus an event, Enter to "grab", arrows to choose a
   day, Enter to drop via `onEventMove(event, newStart)`, Escape to cancel,
   announced in the status region. The consumer applies the move.
3. **Pointer drag** with the same `onEventMove`, built on the keyboard path.
4. **"+N more"** overflow per cell, with a `labels.more(count)` button.
5. **Day view** with a time axis, **now indicator**, and snapping.
6. **Event resize** by keyboard and edge drag (multi-day events first).
7. **Create by selecting** a range, firing `onCreate(start, end)`.
8. **Week numbers** column (`isoWeek` already exists in date-time-picker).
9. **Highlight ranges** (holidays, closures) as `ranges` with a `data-range` hook.

Non-goals stay as §9: no event editor UI, no recurrence, no timezones.

## 13. Shipped in 0.3.0 (2026-10-14)

Ideas 1, 8 and 9 of §11. Each has tests in `CalendarView.test.ts` (§8.22–§8.30).

- **Week numbers** (`showWeekNumbers`): a leading header (`labels.weekNumberHeader`) and a `scope="row"` header per week; the week's
  Thursday decides its ISO number. Off by default.
- **Marked ranges** (`ranges: { start, end, kind?, label? }[]`): `data-range="{kind}"` on each day inside, and the ranges are passed to the
  `day` snippet so it can render `label` as text (never colour alone).
- **Range selection**: Shift+arrows/Home/End/PageUp/PageDown extend from an anchor (the picked day, else the cursor) into `selectedRange`
  (bindable); Enter confirms with `onRangeSelect(start, end)` instead of picking a day; a plain move stops extending but keeps the range;
  Shift+click picks and confirms one; Escape clears. Hooks: `data-in-range`, `data-range-start`, `data-range-end`.
Not built: keyboard and pointer event move, "+N more", day view, resize, create-by-selecting (§11 ideas 2–7).

## 14. Shipped later in 0.3.0 (2026-10-14)

Tests §8.31–§8.50.

- **Day view**: `view="day"` shows one day under one weekday header; `labels.dayView` gates its switcher button; previous/next and
  the arrow and Page keys step one day; `periodRange` is `[anchor, anchor]`.
- **`maxEvents`**: caps events per day. The `day` snippet gets `visibleEvents` (the first `maxEvents`) and `hiddenCount` for a "+N more"
  control; default rendering is unchanged.
- **Event drag-and-drop**: `onEventMove(event, toDate)` turns it on. The `day` snippet's `eventProps(ev)` is spread onto an event element
  to make it draggable (`data-event-id`); dropping on a day calls `onEventMove`; Alt+ArrowLeft/Right (a day) and Alt+ArrowUp/Down (a week)
  on a focused event element is the keyboard alternative (WCAG 2.5.7). Disabled days refuse a move. `labels.eventMoveAnnouncement`.
- **`labels.periodTitle(view, start, end, anchorDate)`**: a visible title (`.calendar-view-title`) between the previous and next buttons.
- **`hideOutsideDays`**: month view leaves outside days empty (the cell stays in the grid with `data-outside-period`).
- **`weekendDays`**: weekday numbers whose cells get `data-weekend`; none by default, weekends differ by country.
- **`selectionMode="multiple"`**: a click or Enter/Space toggles a day in the bindable `selectedDates` (each `data-selected`); `onDayClick` still fires.

## 15. Agenda view (0.4.0, 2026-10-16)

Tests §8.64–§8.68. `view="agenda"` is the list counterpart of the month grid and covers the same period (`periodRange` treats it as the month; `periodDays` is empty). It is a plain `<ol class="calendar-view-agenda" aria-label={label}>` — ordinary tab stops, no roving cursor, no selection or range keys. Each `<li class="calendar-view-agenda-day" data-date>` carries `data-today` / `aria-current="date"` (when `today` is set), `data-weekend` and `data-range`, a `<time class="calendar-view-agenda-date" datetime>` heading (`labels.day(date, weekday, false)`, the ISO date without it) and the day's events: the `day` snippet when given (with the usual `DayArgs`), otherwise one `.calendar-view-event` button per event (its `title` when a string, else its id) that fires `onEventClick`. Only days with events are listed unless `agendaEmptyDays`; `labels.agendaEmpty` shows when there are none. Drag-to-move is a grid feature and does not apply.

## 16. Typed event fields, inline editing, export, hot-path caching (0.5.0, 2026-10-16)

Tests §8.69–§8.82. The data grid's cell types and export, applied to events.

- **Typed fields**: `eventFields` is a list of `{ id, header, type?, options?, numberFormat?, dateFormat?, parse?, exportValue?, exportable?, editable?, editLabel? }`, read from `event.values[id]`. `type` is a
  data-grid cell type; `resolveColumn` fills in the type's `format`, `compare` and `exportValue`, once per `eventFields` / `locale` change. With no `locale` a value shows as stored. The **agenda's default markup**
  shows each event's fields after its title (`<span class="calendar-view-event-fields">` of `.calendar-view-event-field` with `.calendar-view-event-field-name` and the value; empty fields are omitted from read-only
  events). A `day` snippet (grid views, or a custom agenda) is handed `fieldText(event, fieldId)` and draws fields itself.
- **Inline editing (agenda)**: `onFieldEdit({ eventId, fieldId, value, previous })` turns it on. `text`, `number`, `link`, `date`, `time`, `select` and `radio` fields edit; the others display and export only.
  The value becomes a `.calendar-view-field-button` (an ordinary tab stop, named by the header plus the value); clicking or activating it opens `.calendar-view-field-editor` (an `<input>` of the type, or a `<select>`
  of `options`). **Enter** commits, **Escape** cancels, blur commits, **Tab** / **Shift+Tab** commit and move to the event's next / previous editable field. The editor owns its keys, and while an IME is composing
  (`isComposing`, or `keyCode` 229) Enter, Escape and Tab belong to the IME. A value that does not fit the type is refused (the editor stays open, `labels.editInvalid`); an unchanged value reports nothing;
  `labels.editAnnouncement(title, header, text)`. After a commit or cancel focus returns to the field's button. Editing is agenda-only: the grid views have a roving date cursor and the consumer's `day` snippet owns the
  events inside the cells.
- **Export**: `labels.exportCsv` / `exportTsv` / `exportExcel` each gate a `.calendar-view-export-button` (`data-calendar-export-format`) in a `.calendar-view-export` group named by `labels.export`; none renders without
  `labels.exportHeaders` (`title`, `start`, `end`). One row per dated event, by start date: title (its `title` when a string, else its id), first and last day (real dates in Excel; a single-day event repeats its date),
  then every `exportable` field. `exportScope` `"period"` (default: the events that touch the shown period) or `"all"`. Events with neither `date` nor `start`/`end` are left out. Formula-looking text is defused.
  `onExport({ format, filename, eventCount, blob })` may return `false` to take over; otherwise the file is saved and `labels.exportAnnouncement` is announced. The buttons are disabled with nothing to export.
- **Virtualization**: deliberately not added. A calendar period is at most 42 day cells (or 31 agenda days), so windowing would only cost the keyboard cursor; `maxEvents` is the per-day cap that bounds a busy day.
- **Hot path**: the marked ranges per visible day, the selected-date set and the event-by-id map are built once per change, so a render does no per-cell `filter` over `ranges`, `includes` over `selectedDates` or `find` over `events`.

## 17. Search (0.6.0, 2026-10-17)

Tests §8.83–§8.92. Shared across the data grid, kanban board, Gantt chart and calendar (`search-text.ts`, a pure module with its own tests: `foldText`, `searchTerms`, `matchesSearch`, `highlightSegments`).

- **Words**: a query is split on whitespace; every word must appear (AND), in any order, ignoring case and diacritics ("cafe" finds "Café"). A blank query matches everything.
- **In the calendar**: `search` (bindable; `labels.search` names the field) narrows the events. New: the calendar had no search. Only matching events show, in every view (week, four-week, month, agenda); the default text is the event title and every field's text (`searchText` replaces it). The agenda wraps matches in `<mark class="calendar-view-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. Exports hold what the search leaves.
- Highlighting uses `<mark>` only while a search is active and works on the original text (never the folded one); where folding would change a string's length it marks nothing rather than the wrong span.

## 18. Period announcements and navigation limits (0.6.0, 2026-10-17)

Tests §8.93–§8.104.

- **Announcing the period**: whenever the shown period changes — Previous, Next, Today, a view switch, a keyboard move across the edge, or the consumer setting `anchorDate` or `view` — `labels.periodAnnouncement(view, start, end)` is written to the polite `.calendar-view-status` region. One effect watches `view | periodStart | periodEnd`, so no path can forget to announce, and the first render says nothing. (Before, only the buttons and keyboard paths announced; a prop-driven change was silent.)
- **`minDate` / `maxDate` bound navigation**, not just picking: Previous is `aria-disabled="true"` once the period starts on or before `minDate` (Next likewise at `maxDate`) — `aria-disabled`, not `disabled`, so focus is not lost when the button reaches the limit — and activating it does nothing but announce `labels.rangeLimit(limit, date)` ("min" or "max"). Today is `aria-disabled` and inert when today is outside the range. Keyboard moves (arrows, Home/End, PageUp/PageDown) are clamped into the range and announce the same limit. Days outside the range still carry `aria-disabled` and stay focusable, as before. Without `labels.rangeLimit` a stopped move is silent but still stops.

## Filtering and sorting (0.6.0, 2026-10-17)

- **`filter(event)`** hides events it rejects in every view, combining with `search` (both must pass).
- **`eventCompare(a, b)`** orders the events within a day, and so in the agenda; stable.

## Export: copy to clipboard (0.6.0, 2026-10-17)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same events, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## In-place edit: validation, undo and redo (0.6.0, 2026-10-17)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable: return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(event, header, reason)` is announced, falling back to `labels.editInvalid`. Undo and redo work from anywhere in the calendar.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit`. `labels.undoAnnouncement(event, header, text)` / `labels.redoAnnouncement(event, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.6.0, 2026-10-17)

- **Marked ranges** (`ranges`: `{ start, end, kind?, label? }`, already there for holidays, closures and terms) now carry their `label` as real text: shown beside the day number (and the agenda date) when there is no `day` snippet, and read as the cell's description (`aria-describedby` a hidden span, several labels joined with ", "), so a screen reader hears why a day is marked and the day is never colour-only. A range without a label marks the day and adds no text. A `day` snippet still receives `ranges` and renders its own.
- **Weekends**: the weekday header cells now carry `data-weekend` like the day cells (`weekendDays`, never defaulted).
- **Shading** is CSS and ships in the 57 reference themes: weekend cells are tinted; a day inside a range is tinted and striped.

## Narrow screens, agenda dates, today and direction (0.6.0, 2026-10-17)

- **Agenda on a narrow screen.** `agendaBelow` (pixels, for example `640`) makes a viewport narrower than that read as the agenda view; the `view` prop is untouched, so a wide screen goes back to it. A view the user picks with the switcher is respected until the screen is wide again. It uses `matchMedia` after mount (a server renders `view`); without `matchMedia` nothing changes. This replaces a hand-written `matchMedia` switch in the app.
- **Hide the agenda date.** `agendaDate={false}` hides the date beside each day's events visually (a clipped, one-pixel `<time datetime>` with `data-visually-hidden`), so a layout that shows its own date can drop it and a screen reader still gets it. Default `true`.
- **Today holds its contrast.** The reference themes mark today with a ring in the cell's own text colour (`currentColor`) and a bold number, never a fill: it stays readable on a light page, a dark page and a selected cell, and says "today" without colour. The calendar table is `table-layout: fixed` with `min-width: 0` day cells that wrap, so a phone never clips them.
- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout (the nearest `dir`) ArrowLeft goes to the next day, and Shift+Arrow and Alt+Arrow (moving an event) follow the arrow. Up, Down, Home, End and the page keys are unchanged. `isRtl` / `logicalKey` are exported.
- Tests §8.131–§8.146, including a complete Chinese bundle that must leave no English in the DOM.
