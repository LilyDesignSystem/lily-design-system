# MultiSelectWithExtras

A wrapper `<div>` with `Before`/`After` content around a native `<select multiple>`. Same shape as `SelectWithExtras`.
See `components/multi-select-with-extras/index.md`.

## Parameters

- `Label`: string (required) — `aria-label` on the `<select>`, not the wrapper
- `Value` / `ValueChanged`: string[] — `@bind-Value`
- `Size`, `Required`, `Disabled`: on the `<select>`
- `Before`, `After`: RenderFragments around the select
- `ChildContent`: `Option` elements
- `CssClass`, `AdditionalAttributes`: on the wrapper
