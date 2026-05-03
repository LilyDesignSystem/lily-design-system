# WeekInput

An input for selecting a week and year <input type="week">.

See `components/week-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `week-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<WeekInput Label="...">
    Content
</WeekInput>
```
