# `<calendar-view>` (HTML) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `calendar-view.test.ts`.
When the two disagree, the Svelte side wins.

## Differences from Svelte (idiom only)

- `view`, `anchorDate`, `selectedDate` are attributes/properties
  (`view`, `anchor-date`, `selected-date`); the element writes them back as it
  navigates, so they are readable at any time.
- Arrays and functions (`events`, `labels`, `isDisabled`) are properties only.
- Callbacks are properties (`onNavigate`, `onDayClick`, `onEventClick`) and
  bubbling, composed events (`calendarnavigate`, `dayclick`, `eventclick`).
- The `day` snippet is the instance-overridable `renderDay(args)` hook, whose
  `args` carry `selected`, `disabled` and `openEvent`.
- The table markup is built by hand from the `calendar-table*` contract in
  `@lilydesignsystem/html-headless`; civil-date arithmetic comes from
  `@lilydesignsystem/html-date-time-picker`.
- Every state change rebuilds the table; focus is restored to the cursor cell
  after a keyboard-driven change.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.22–§8.30): week numbers (`showWeekNumbers`), marked ranges (`ranges`, `data-range`) and range selection (`selectedRange`, `onRangeSelect`, `data-in-range`, `data-range-start`, `data-range-end`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §8.31–§8.50): the one-day view (`day`, `labels.dayView`), `maxEvents` (the day context gets `visibleEvents` and `hiddenCount`), event drag-and-drop with Alt+arrow keys (`onEventMove`, `eventProps`, `labels.eventMoveAnnouncement`), `labels.periodTitle`, `hideOutsideDays`, `weekendDays` (`data-weekend`) and multiple selection (`selectionMode`, `selectedDates`).

## Agenda view (2026-10-16)

Ported from the Svelte canonical (its spec "Agenda view", tests §8.64–§8.68): `view="agenda"` is the list counterpart of the month grid over the same period (`periodRange` treats it as the month; `periodDays` is empty). A plain `<ol class="calendar-view-agenda" aria-label>` with ordinary tab stops, no roving cursor, no selection keys. Each `<li class="calendar-view-agenda-day" data-date>` carries `data-today` / `aria-current="date"`, `data-weekend`, `data-range`, a `<time class="calendar-view-agenda-date" datetime>` heading (`labels.day(date, weekday, false)`, else the ISO date) and the day's events — `renderAgendaDay` (overridable), by default a `.calendar-view-event` button per event (its `title` when a string, else its id) that fires `eventclick`. Only days with events unless `agenda-empty-days`; `labels.agendaEmpty` shows when there are none.

## Typed event fields, inline editing, export, hot-path caching (0.5.0, 2026-10-16)

Tests §8.69–§8.82. The data grid's cell types and export, applied to events.

- **Typed fields**: `eventFields` is a list of `{ id, header, type?, options?, numberFormat?, dateFormat?, parse?, exportValue?, exportable?, editable?, editLabel? }`, read from `event.values[id]`. `type` is a
  data-grid cell type; `resolveColumn` fills in the type's `format`, `compare` and `exportValue`, once per `eventFields` / `locale` change. With no `locale` a value shows as stored. The **agenda's default markup**
  shows each event's fields after its title (`<span class="calendar-view-event-fields">` of `.calendar-view-event-field` with `.calendar-view-event-field-name` and the value; empty fields are omitted from read-only
  events). A `renderDay` override (grid views, or a custom agenda) is handed `fieldText(event, fieldId)` and draws fields itself.
- **Inline editing (agenda)**: Setting `onFieldEdit` (called with `{ eventId, fieldId, value, previous }`; the `fieldedit` event carries the same, and `editableFields` turns editing on for a consumer that only listens, since an element cannot see its own listeners) turns it on. `text`, `number`, `link`, `date`, `time`, `select` and `radio` fields edit; the others display and export only.
  The value becomes a `.calendar-view-field-button` (an ordinary tab stop, named by the header plus the value); clicking or activating it opens `.calendar-view-field-editor` (an `<input>` of the type, or a `<select>`
  of `options`). **Enter** commits, **Escape** cancels, blur commits, **Tab** / **Shift+Tab** commit and move to the event's next / previous editable field. The editor owns its keys, and while an IME is composing
  (`isComposing`, or `keyCode` 229) Enter, Escape and Tab belong to the IME. A value that does not fit the type is refused (the editor stays open, `labels.editInvalid`); an unchanged value reports nothing;
  `labels.editAnnouncement(title, header, text)`. After a commit or cancel focus returns to the field's button. Editing is agenda-only: the grid views have a roving date cursor and the consumer's `renderDay` override owns the
  events inside the cells.
- **Export**: `labels.exportCsv` / `exportTsv` / `exportExcel` each gate a `.calendar-view-export-button` (`data-calendar-export-format`) in a `.calendar-view-export` group named by `labels.export`; none renders without
  `labels.exportHeaders` (`title`, `start`, `end`). One row per dated event, by start date: title (its `title` when a string, else its id), first and last day (real dates in Excel; a single-day event repeats its date),
  then every `exportable` field. `exportScope` `"period"` (default: the events that touch the shown period) or `"all"`. Events with neither `date` nor `start`/`end` are left out. Formula-looking text is defused.
  `onExport` (given `{ format, filename, eventCount, blob }`; the `exportfile` event carries the same) may return `false` to take over; otherwise the file is saved and `labels.exportAnnouncement` is announced. The buttons are disabled with nothing to export.
- **Virtualization**: deliberately not added. A calendar period is at most 42 day cells (or 31 agenda days), so windowing would only cost the keyboard cursor; `maxEvents` is the per-day cap that bounds a busy day.
- **Hot path**: the marked ranges per visible day, the selected-date set and the event-by-id map are built once per change, so a render does no per-cell `filter` over `ranges`, `includes` over `selectedDates` or `find` over `events`.
