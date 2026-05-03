# ScrollBar

A custom scrollbar element.

See `components/scroll-bar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `scroll-bar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ScrollBar Label="...">
    Content
</ScrollBar>
```
