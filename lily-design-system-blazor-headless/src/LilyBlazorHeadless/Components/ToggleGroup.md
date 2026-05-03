# ToggleGroup

A group of toggle buttons for selecting options.

See `components/toggle-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `toggle-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ToggleGroup Label="...">
    Content
</ToggleGroup>
```
