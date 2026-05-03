# DateTimeNowInput

An input for entering a date and time and "now" button <input type="date"><input type="time"><button type="button">.

See `components/date-time-now-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `date-time-now-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DateTimeNowInput Label="...">
    Content
</DateTimeNowInput>
```
