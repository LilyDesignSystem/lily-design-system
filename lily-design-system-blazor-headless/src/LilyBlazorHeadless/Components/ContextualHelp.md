# ContextualHelp

A help button that opens a popover with explanatory content.

See `components/contextual-help/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `contextual-help`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ContextualHelp Label="...">
    Content
</ContextualHelp>
```
