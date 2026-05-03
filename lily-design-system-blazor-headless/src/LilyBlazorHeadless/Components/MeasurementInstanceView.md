# MeasurementInstanceView

A read-only display of a measurement value and unit.

See `components/measurement-instance-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `measurement-instance-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MeasurementInstanceView>
    Content
</MeasurementInstanceView>
```
