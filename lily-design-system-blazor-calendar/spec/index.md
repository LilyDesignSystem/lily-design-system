# CalendarView (Blazor) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `CalendarViewTests.cs`.
When the two disagree, the Svelte side wins.

## Differences from Svelte (idiom only)

- `View`, `AnchorDate`, `SelectedDate` are `Value` + `ValueChanged` pairs
  (`@bind-View` and so on). `View` is the `CalendarViewMode` enum.
- Callbacks are `EventCallback`s: `OnNavigate` (a `(View, Start, End)` tuple),
  `OnDayClick`, `OnEventClick`.
- The `day` snippet is the `Day` `RenderFragment<CalendarDayContext>`; its
  context carries `Selected`, `Disabled` and `OpenEvent`.
- `CalendarEvent` is typed (`Id`, `Date`, `Start`, `End`, `Title`) rather than an
  open record; `Title` feeds the default event button.
- `CalendarTableTD` has no `Selected`/`Today` parameters in this catalog, so
  `tabindex`, `aria-selected` and `aria-current` are ordinary attributes splatted
  through it. Focus follows the cursor via a JS-eval `focus()` after render, as in
  `KanbanBoard`; bUnit asserts intent, not real focus.
- Blazor cannot conditionally `preventDefault` a keydown; Arrow/Page keys may
  also scroll the page.

## Composition

`LilyBlazorHeadless`'s `CalendarTable` family, unmodified, and the static civil-date
arithmetic of the sibling `LilyDesignSystem.Blazor.DateTimePicker`.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.22–§8.30): week numbers (`showWeekNumbers`), marked ranges (`ranges`, `data-range`) and range selection (`selectedRange`, `onRangeSelect`, `data-in-range`, `data-range-start`, `data-range-end`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §8.31–§8.50): the one-day view (`day`, `labels.dayView`), `maxEvents` (the day context gets `visibleEvents` and `hiddenCount`), event drag-and-drop with Alt+arrow keys (`onEventMove`, `eventProps`, `labels.eventMoveAnnouncement`), `labels.periodTitle`, `hideOutsideDays`, `weekendDays` (`data-weekend`) and multiple selection (`selectionMode`, `selectedDates`).

## Agenda view (2026-10-16)

Ported from the Svelte canonical (its spec "Agenda view", tests §8.64–§8.68): `View="CalendarViewMode.Agenda"` is the list counterpart of the month grid over the same period (`periodRange` treats it as the month; `periodDays` is empty). A plain `<ol class="calendar-view-agenda" aria-label>` with ordinary tab stops, no roving cursor, no selection keys. Each `<li class="calendar-view-agenda-day" data-date>` carries `data-today` / `aria-current="date"`, `data-weekend`, `data-range`, a `<time class="calendar-view-agenda-date" datetime>` heading (`labels.day(date, weekday, false)`, else the ISO date) and the day's events — the `Day` template when given, otherwise a `.calendar-view-event` button per event (its `title` when a string, else its id) that fires `OnEventClick`. Only days with events unless `AgendaEmptyDays`; `Labels.AgendaEmpty` shows when there are none.

## Typed event fields, inline editing, export (0.5.0, 2026-10-16)

The data grid's cell types and export, applied to events; ported from the Svelte canonical with these Blazor idioms.

- **Typed fields**: `EventFields` is a list of `DataGridColumn` (the data grid's own record: `Id`, `Header`, `Type`, `Options`, `NumberFormat`, `DateFormat`, `TimeFormat`, `Parse`, `Validate`, `Exportable`, `ExportValue`, `Editable`, …), read from `event.Values[id]` (a `DataGridRow`). `Type` fills in the field's `Format`, `Compare` and `ExportValue` through the data grid's `CellTypes.Resolve`, once per `EventFields` / `Locale` change. With no `Locale` a value shows as stored. A field shows after each event's title in the agenda (editing is agenda-only) as a `.calendar-view-event-field`-style element holding its header (`.calendar-view-event-field-name`) and its value; a read-only event omits empty fields.
- **Inline editing**: a field edits in place when its `Editable` is set, `OnFieldEdit` has a handler, the calendar is not `Readonly`. `Text`, `Number`, `Link`, `Date`, `Time`, `Select` and `Radio` fields edit; the others display and export only. The value becomes a `.calendar-view-field-button` (`tabindex="-1"` in the board and chart; named by the header plus the value); clicking it opens `.calendar-view-field-editor` (an `<input>` of the type, or a `<select>` of `Options`). **Enter** commits, **Escape** cancels, blur commits; the editor owns its keys (they never reach the grid), and an input method's composing keys (`"Process"`) never commit or cancel. A value that does not fit the type, or that `Validate` refuses, is refused: the editor stays open and `Labels.EditInvalid` is announced. An unchanged value reports nothing. **Blazor deviation:** Tab does not move to the next field's editor (a keydown handler cannot decide `preventDefault` per event); it moves on normally and the blur commits. `OnFieldEdit` receives a `CalendarFieldEdit` (`EventId`, `FieldId`, `Value`, `Previous`); `Labels.EditAnnouncement(title, header, text)`.
- **Export**: `Labels.ExportCsv` / `ExportTsv` / `ExportExcel` each gate a `.calendar-view-export-button` (`data-calendar-export-format`) in a `.calendar-view-export` group named by `Labels.Export`; none renders without `Labels.ExportHeaders` (a `CalendarExportHeaders`: `Title`, `Start`, `End`). One row per dated event, by start date: title, first and last day (real dates in Excel; a single-day event repeats its date), then every field with `Exportable`. `ExportScope`: `Period` (default: the events that touch the shown period) or `All`. Events with neither `Date` nor `Start`/`End` are left out. `ExportFilename` is the base name. `OnExport` is raised with the `DataGridExport`; `ExportHandler` returning `false` takes over the download; otherwise the file is saved and `Labels.ExportAnnouncement` is announced.
- **Virtualization**: deliberately not added. A calendar period is at most 42 day cells (or 31 agenda days), so windowing would only cost the keyboard cursor; `MaxEvents` is the per-day cap that bounds a busy day.
- **Dependency**: the package references `LilyDesignSystem.Blazor.DataGrid` (for `DataGridColumn`, `CellTypes`, `ExportData`, `DataGridExport`) rather than copying its sources; `TypedFields.cs` is the small internal helper that reads, formats, parses and exports one field.
