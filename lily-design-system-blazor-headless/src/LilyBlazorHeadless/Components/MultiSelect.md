# MultiSelect

A native `<select multiple>` for choosing several options at once. Native keyboard only.
See `components/multi-select/index.md`.

## Parameters

- `Label`: string (required) — `aria-label`
- `Value` / `ValueChanged`: string[] — selected option values, `@bind-Value`
- `Size`: int? — visible rows
- `Required`, `Disabled`, `CssClass`, `AdditionalAttributes`
- `ChildContent`: `Option` elements

## Usage

```razor
<MultiSelect Label="Toppings" @bind-Value="toppings">
    <Option value="a">Anchovies</Option>
</MultiSelect>
```

## Notes

bUnit cannot observe which options the renderer marks selected from `Value`; initial selection is applied by Blazor's own `@bind:get` handling for `<select multiple>` at runtime.
