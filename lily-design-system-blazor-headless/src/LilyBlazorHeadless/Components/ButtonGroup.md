# ButtonGroup

A wrapper that groups related buttons together.

See `components/button-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `button-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ButtonGroup Label="...">
    Content
</ButtonGroup>
```
