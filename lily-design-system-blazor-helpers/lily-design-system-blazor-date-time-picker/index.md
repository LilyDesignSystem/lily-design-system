# DateTimePicker (Blazor helper)

A headless Blazor 10 date/time-picking form control: a text field plus an
icon button (📅) that opens a WAI-ARIA APG **Date Picker Dialog** — a month
grid with a full keyboard contract. Collects a date, a time, or both, and
is locale-correct by construction.

Ships no CSS. The single source of truth is
[spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

Add a project reference to
`LilyDesignSystem.Blazor.DateTimePicker.csproj`, or the published
`LilyDesignSystem.Blazor.DateTimePicker` NuGet package.

```xml
<ProjectReference Include="path/to/LilyDesignSystem.Blazor.DateTimePicker.csproj" />
```

## Quick start

```razor
@using LilyDesignSystem.Blazor.Helpers

<DateTimePicker Label="Appointment date"
                Labels="@Labels"
                @bind-Value="_appointmentDate" />

@code {
    private string _appointmentDate = "";

    private static readonly DateTimePickerLabels Labels = new()
    {
        PreviousYear = "Previous year",
        PreviousMonth = "Previous month",
        NextMonth = "Next month",
        NextYear = "Next year",
        Confirm = "OK",
        Cancel = "Cancel",
    };
}
```

`Value` is ISO: `YYYY-MM-DD` for the default `Mode="Date"`, `HH:MM` for
`Mode="Time"`, `YYYY-MM-DDTHH:MM` for `Mode="DateTime"`. Sortable as a
string, unambiguous across locales, and identical to what
`<input type="date">` posts.

## Locale is derived, not chosen

Month names, weekday names, first day of week, numeric field order, and
the 12/24-hour clock all come from `Locale` (a BCP 47 tag) via .NET's
`CultureInfo` / `DateTimeFormatInfo` — never a hardcoded English table.
Leave `Locale` unset and the runtime default culture drives everything;
set it and the whole dialog follows, including which day the week starts
on and whether `03/04/2026` means 3 April or 4 March.

```razor
<DateTimePicker Label="Dyddiad" Labels="@WelshLabels" Locale="cy-GB" @bind-Value="_value" />
```

Override any single derived default without overriding the rest:
`FirstDayOfWeek` (0=Sunday…6=Saturday), `Hour12` (true forces a 12-hour
clock regardless of locale).

## Constraining selection

```razor
<DateTimePicker Label="Appointment date"
                Labels="@Labels"
                Min="@DateTimePicker.FormatIsoDate(new CivilDate(2026, 1, 1))"
                Max="@_maxBookableDate"
                IsDateDisabled="@(iso => DateTimePicker.WeekdayOf(iso) is 0 or 6)"
                @bind-Value="_value" />
```

`Min`/`Max` are inclusive. `IsDateDisabled` vetoes individual dates — here,
a weekends-closed clinic. A vetoed day renders `aria-disabled="true"` plus
`data-disabled` — **not** the `disabled` attribute — so it stays focusable
and a screen reader announces it as unavailable rather than going silent;
activation is simply refused. Style vetoed days with `[data-disabled]` or
`[aria-disabled="true"]`, not `:disabled`. The keyboard cursor can still
cross a vetoed day inside the range (so arrowing across a blocked week
works), but it cannot leave the `Min`/`Max` window: there is nothing out
there to navigate to.

The full civil-date arithmetic (`AddDays`, `AddMonths`, `WeekdayOf`,
`ParseIsoDate`, …) is `public static` on `DateTimePicker`, exported for
exactly this reason: wiring `Min`/`Max`/`IsDateDisabled` is date maths too,
and the alternative is reaching for a zoned `DateTime` and reintroducing
the local-midnight bug civil dates exist to avoid.

## Shortcuts

```razor
<DateTimePicker Label="Follow-up date" Labels="@Labels"
                Shortcuts="@Shortcuts" @bind-Value="_value" />

@code {
    private static readonly DateTimeShortcut[] Shortcuts =
    {
        new() { Id = "today", Label = "Today", Days = 0 },
        new() { Id = "two-weeks", Label = "+2 weeks", Days = 14 },
        new() { Id = "one-month", Label = "+1 month", Months = 1 },
    };
}
```

A shortcut that resolves to a blocked date (outside `Min`/`Max`, or vetoed
by `IsDateDisabled`) does nothing rather than landing near it — a
"+4 weeks" that quietly means "+27 days" is a booking error.

## Time and datetime

```razor
<DateTimePicker Label="Appointment time" Labels="@TimeLabels"
                Mode="DateTimeMode.Time" MinuteStep="15" Hour12="true"
                @bind-Value="_time" />
```

`Mode="Time"` needs `Labels.Hour` and `Labels.Minute`; a 12-hour clock (by
locale default or `Hour12="true"`) additionally needs `Labels.Meridiem`.
`Mode="DateTime"` renders both the grid and the time selects and refuses
to commit a date with no time, or the reverse — half a timestamp is a
different truth, not a smaller one.

## Typed input

The text field accepts typed dates as well as picker selection. Resolution
is tried on blur or `Enter`, in order: a `ParseInput` you supply (if any),
ISO `YYYY-MM-DD`, a numeric form whose field order follows the locale, or
a form with a written month matched against the locale's own month names
(three-character prefix match, so "Sept" finds September, case- and
diacritic-insensitively). Two-digit years pivot at 70.

Text that will not parse, or that parses to a blocked date, stays exactly
as typed and sets `aria-invalid="true"`, firing `OnInvalidInput` — it is
never silently snapped to a nearby legal date the user did not type.
`Escape` in the field discards a pending typed edit, restoring the
committed display and clearing the invalid state without committing
anything; when nothing is pending the key is left alone.

Supply `Labels.Invalid` to have the refusal *announced* as well as
marked: a `role="status"` live region (class hook
`date-time-picker-status`, present-but-empty while the field is valid)
fills with your message and is wired to the field via `aria-errormessage`
plus an appended `aria-describedby`. Without it, `aria-invalid` flips
silently and a screen-reader user who has already left the field never
learns their date was refused.

```razor
<DateTimePicker Label="Date of birth" Labels="@Labels"
                OnInvalidInput="@(text => _dobError = $"Could not read \"{text}\" as a date")"
                @bind-Value="_dob" />
```

## Clear button

```razor
<DateTimePicker Label="Appointment date" Labels="@ClearableLabels" @bind-Value="_value" />

@code {
    private static readonly DateTimePickerLabels ClearableLabels = new()
    {
        PreviousYear = "Previous year", PreviousMonth = "Previous month",
        NextMonth = "Next month", NextYear = "Next year",
        Confirm = "OK", Cancel = "Cancel",
        Clear = "Clear date",
    };
}
```

The clear button renders only when `Labels.Clear` is supplied — there is
no default, because a default would be a hardcoded English string.

## Dialog keyboard help

Supply `Labels.Instructions` to render keyboard help inside the dialog
(class hook `date-time-picker-instructions`, the dialog's first child)
and have the dialog reference it via `aria-describedby`, so a screen
reader speaks it once on open — the APG date-picker example ships exactly
this affordance. It is visible by default; hide it with your own CSS if
you want it screen-reader-only. Like every other label, it renders
nothing when not supplied.

## Custom glyph

`ChildContent` replaces the 📅 glyph inside the trigger button and receives
a `DateTimePickerContext` of `{ Value, Open, Display }`:

```razor
<DateTimePicker Label="Appointment date" Labels="@Labels" @bind-Value="_value">
    <span class="my-icon" aria-hidden="true">@(context.Open ? "▲" : "📅")</span>
</DateTimePicker>
```

## Parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-parameters).
Required: `Label`, `Labels`.

## Static helpers

| Member | Purpose |
| --- | --- |
| `DateTimePicker.Calendar` | The default glyph, `"📅︎"` (U+1F4C5 + U+FE0E). |
| `DateTimePicker.NextDateTimePickerId()` | Mint a stable, prerender-safe id prefix. |
| `DateTimePicker.ParseIsoDate` / `FormatIsoDate` | ISO date parsing/formatting. |
| `DateTimePicker.AddDays` / `AddMonths` | Civil-date arithmetic (`AddMonths` clamps the day). |
| `DateTimePicker.WeekdayOf` / `IsoWeek` | Day-of-week and ISO-8601 week number. |
| `DateTimePicker.ParseDateInput` / `ParseTimeInput` | The typed-input parsers, directly callable. |
| `DateTimePicker.FirstDayOfWeekFor(locale)` | The locale's first weekday. |

Full list in [spec/index.md §4.4](./spec/index.md#44-public-surface).

## Accessibility

- Follows the WAI-ARIA APG **Date Picker Dialog** pattern: `role="dialog"`,
  `aria-modal="true"`, `role="grid"`, roving `tabindex`, full keyboard
  contract, a **real** focus trap.
- Closing the dialog returns focus to whichever element opened it — the
  trigger button after a click, the text field after `Alt`+`ArrowDown` —
  per the APG dialog pattern. Click-outside (which includes the
  component's own text field, honouring `aria-modal`) closes without
  moving focus.
- Vetoed days are `aria-disabled`, never `disabled`, so the roving cursor
  can land on them with real focus and a screen reader announces them as
  unavailable instead of going silent.
- The glyph is `aria-hidden`; the trigger's and dialog's accessible name
  both come from `Label`.
- **Tradeoff:** a hand-rolled grid has weaker assistive-technology support
  than `<input type="date">`, which is the right default for many
  services. See [docs/accessibility.md](./docs/accessibility.md).

## Styling

Class hooks: `.date-time-picker` (root), `.date-time-picker-field`,
`.date-time-picker-input`, `.date-time-picker-button`,
`.date-time-picker-icon`, `.date-time-picker-status` (only with
`Labels.Invalid`), `.date-time-picker-dialog`,
`.date-time-picker-instructions` (only with `Labels.Instructions`),
`.date-time-picker-header`, `.date-time-picker-previous-year` /
`-previous-month` / `-next-month` / `-next-year`, `.date-time-picker-period`,
`.date-time-picker-calendar`, `.date-time-picker-week-heading`,
`.date-time-picker-weekday`, `.date-time-picker-week`,
`.date-time-picker-day`, `.date-time-picker-time`,
`.date-time-picker-time-label`, `.date-time-picker-hour` /
`-minute` / `-meridiem`, `.date-time-picker-shortcuts`,
`.date-time-picker-shortcut`, `.date-time-picker-footer`,
`.date-time-picker-clear` / `-cancel` / `-confirm`.

The package ships no CSS and no positioning for the dialog — without
positioning CSS from the consumer, it renders in normal document flow
rather than as an overlay.

## Tests

From `../tests/LilyDesignSystem.Blazor.Helpers.Tests`:

```sh
dotnet test
```

65 cases for this package, one or more per §7 clause.

---

Lily™ and Lily Design System™ are trademarks.
