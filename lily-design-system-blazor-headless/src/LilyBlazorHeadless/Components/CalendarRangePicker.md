# CalendarRangePicker

A picker for selecting a date range on a calendar.

See `components/calendar-range-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `calendar-range-picker`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CalendarRangePicker Label="...">
    Content
</CalendarRangePicker>
```
