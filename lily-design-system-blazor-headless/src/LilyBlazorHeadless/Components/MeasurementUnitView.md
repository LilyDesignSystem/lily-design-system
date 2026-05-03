# MeasurementUnitView

A read-only display of a measurement unit.

See `components/measurement-unit-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `measurement-unit-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MeasurementUnitView>
    Content
</MeasurementUnitView>
```
