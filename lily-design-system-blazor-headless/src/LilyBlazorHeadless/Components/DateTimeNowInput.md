# DateTimeNowInput

A date input, a time input and a "Now" button that fills both with the current local date and time, in a labelled `<div role="group">`.

See `components/date-time-now-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — the group's accessible name
- `DateLabel`, `TimeLabel`, `NowLabel`: string (required, no default) — the date input's and time input's names and the button's text; take them from a locale pack with `LocaleTranslations.DateTimeNowInputLabels(locale)`
- `DateValue` / `DateValueChanged`: string, `YYYY-MM-DD` (`@bind-DateValue`)
- `TimeValue` / `TimeValueChanged`: string, `HH:mm` (`@bind-TimeValue`)
- `Required`, `Disabled`: bool — applied to both inputs (and `Disabled` to the button)
- `CssClass`: string — extra CSS classes appended to `date-time-now-input`
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
@using LilyDesignSystem.Blazor.LocaleTranslations

@{ var names = LocaleTranslations.DateTimeNowInputLabels("es-001"); }
<DateTimeNowInput Label="Hora de la cita"
                  DateLabel="@names.Date" TimeLabel="@names.Time" NowLabel="@names.Now"
                  @bind-DateValue="date" @bind-TimeValue="time" />
```
