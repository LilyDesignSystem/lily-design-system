# MeasurementSystemInput

An input for selecting a measurement system.

See `components/measurement-system-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `measurement-system-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MeasurementSystemInput Label="...">
    Content
</MeasurementSystemInput>
```
