# DateRange

Paired start and end date inputs in a `<fieldset>`.

See `components/date-range/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible group label, set on the fieldset's `aria-label`
- `StartLabel`: string (required) — accessible label for the start date input
- `EndLabel`: string (required) — accessible label for the end date input
- `Start` / `StartChanged`: string — start date, `YYYY-MM-DD`; supports `@bind-Start`
- `End` / `EndChanged`: string — end date, `YYYY-MM-DD`; supports `@bind-End`
- `CssClass`: string — extra CSS classes appended to `date-range`
- `AdditionalAttributes`: catches unmatched HTML attributes (spread onto the fieldset)

## Usage

```razor
<DateRange Label="Trip dates" StartLabel="Departure" EndLabel="Return"
           @bind-Start="departure" @bind-End="return" />
```
