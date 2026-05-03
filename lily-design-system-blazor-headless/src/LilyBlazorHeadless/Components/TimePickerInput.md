# TimePickerInput

An input with a dropdown for picking a time.

See `components/time-picker-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `time-picker-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TimePickerInput Label="...">
    Content
</TimePickerInput>
```
