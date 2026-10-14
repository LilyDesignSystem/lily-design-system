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
