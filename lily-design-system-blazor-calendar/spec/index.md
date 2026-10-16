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
