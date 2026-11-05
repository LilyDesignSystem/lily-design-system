# SelectWithExtras

A select dropdown with additional features like search or groups.

See `components/select-with-extras/index.md` for canonical documentation.

## Parameters

- `Label`: string (required)
- `Value`, `ValueChanged`: two-way with `@bind-Value`
- `Required`, `Disabled`: bool
- `ChildContent` — the options; `Before`, `After`: RenderFragment
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<SelectWithExtras Label="Colour" @bind-Value="colour">
    <Before><span>Before</span></Before>
    <ChildContent><option value="red">Red</option></ChildContent>
</SelectWithExtras>
```
