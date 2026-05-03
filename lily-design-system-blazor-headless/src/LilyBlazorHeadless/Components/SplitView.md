# SplitView

A two-panel resizable layout container with a draggable divider between them.

See `components/split-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `split-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SplitView Label="...">
    Content
</SplitView>
```
