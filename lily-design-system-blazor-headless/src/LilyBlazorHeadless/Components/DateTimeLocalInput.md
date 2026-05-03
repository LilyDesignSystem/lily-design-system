# DateTimeLocalInput

An input for entering a date and time without time zone <input type="datetime-local">.

See `components/date-time-local-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `date-time-local-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DateTimeLocalInput Label="...">
    Content
</DateTimeLocalInput>
```
