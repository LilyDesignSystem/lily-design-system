# CalendarTable

A calendar table interactive grid for managing dates, days, etc. <table>.

See `components/calendar-table/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `calendar-table`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CalendarTable Label="...">
    Content
</CalendarTable>
```
