# `<lily-calendar-view>` (Web Components) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `calendar-view.test.ts`.
When the two disagree, the Svelte side wins.

## Relationship to the HTML helper

This is a maintainer-directed **independent copy** of
`@lilydesignsystem/html-calendar` (see `AGENTS/helpers.md`): the same code
with the `lily-` tag prefix and the Web Components date-time-picker. Nothing
ports between them automatically; keep them in step deliberately. The table is
built by hand, as in the HTML helper, rather than by nesting
`<lily-calendar-table>`, whose consumer-supplied rows would add a wrapper
element with no benefit here.

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
  `@lilydesignsystem/web-components-headless`; civil-date arithmetic comes from
  `@lilydesignsystem/web-components-date-time-picker`.
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

## 17. Search (0.6.0, 2026-10-17)

Tests §8.83–§8.92. Shared across the data grid, kanban board, Gantt chart and calendar (`search-text.ts`, a pure module with its own tests: `foldText`, `searchTerms`, `matchesSearch`, `highlightSegments`).

- **Words**: a query is split on whitespace; every word must appear (AND), in any order, ignoring case and diacritics ("cafe" finds "Café"). A blank query matches everything.
- **In the calendar**: `search` (a property; `labels.search` names the field) narrows the events. New: the calendar had no search. Only matching events show, in every view (week, four-week, month, agenda); the default text is the event title and every field's text (`searchText` replaces it). The agenda wraps matches in `<mark class="calendar-view-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. Exports hold what the search leaves.
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
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit` and the `fieldedit` event** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit` and the `fieldedit` event. `labels.undoAnnouncement(event, header, text)` / `labels.redoAnnouncement(event, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

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
