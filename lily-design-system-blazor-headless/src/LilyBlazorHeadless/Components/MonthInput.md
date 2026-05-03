# MonthInput

An input for selecting a month and year <input type="month">.

See `components/month-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `month-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MonthInput Label="...">
    Content
</MonthInput>
```
