# MeasurementInstanceInput

An input for entering a measurement value and unit.

See `components/measurement-instance-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `measurement-instance-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MeasurementInstanceInput Label="...">
    Content
</MeasurementInstanceInput>
```
