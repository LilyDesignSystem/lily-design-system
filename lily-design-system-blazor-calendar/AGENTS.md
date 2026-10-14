# AGENTS — CalendarView (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-calendar/spec/index.md).

A headless Blazor calendar: week, four-week or padded month, previous/next/today, a view
switcher, APG grid keyboard navigation (roving tabindex), a picked day, disabled days, and
event buttons per day. Composes the headless `CalendarTable` family and the sibling
`DateTimePicker`'s civil-date arithmetic. Ships no CSS.

Files: `CalendarView.razor` (markup), `CalendarView.razor.cs` (code-behind, public pure helpers),
`CalendarViewTests.cs` (bUnit, one test per §8 clause), `tests/` (the test project).

Parameters: `Label`, `View`, `AnchorDate`, `SelectedDate` (each bindable), `Events`, `Today`,
`MinDate`, `MaxDate`, `IsDisabled`, `Locale`, `Labels`, `OnNavigate`, `OnDayClick`, `OnEventClick`,
`Day`, `CssClass`. Keys: arrows, Home/End, PageUp/PageDown, Enter/Space (pick), `t` (today).

Test: `cd tests && dotnet test`.
