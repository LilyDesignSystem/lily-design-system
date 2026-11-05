# TimePickerInput

An input with a dropdown for picking a time.

See `components/time-picker-input/index.md` for canonical documentation.

A native `<input type="time">`. Blazor adds `:00` to a time in the browser; the component removes it, so `Value` stays `HH:MM`.

## Parameters

- `Label`: string (required) — accessible name
- `Value`, `ValueChanged`: string, `HH:MM` — two-way with `@bind-Value`
- `Required`, `Disabled`: bool
- `CssClass`: string — extra CSS classes appended to `time-picker-input`
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TimePickerInput Label="Start" @bind-Value="start" />
```
