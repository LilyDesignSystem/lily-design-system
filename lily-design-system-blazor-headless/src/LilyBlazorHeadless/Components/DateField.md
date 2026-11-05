# DateField

A structured field for entering date components.

See `components/date-field/index.md` for canonical documentation.

## Parameters

- `Label`: string (required)
- `Value`, `ValueChanged`: `YYYY-MM-DD`, two-way with `@bind-Value`
- `Description`, `Error`: string; `Required`, `Disabled`: bool
- `Id`: string — the input's id
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<DateField Label="Birthday" Error="@error" @bind-Value="birthday" />
```
