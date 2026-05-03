# MeasurementUnitInput

An input for selecting a measurement unit.

See `components/measurement-unit-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `measurement-unit-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MeasurementUnitInput Label="...">
    Content
</MeasurementUnitInput>
```
