# Visible

An IntersectionObserver wrapper that exposes element visibility state.

See `components/visible/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `visible`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Visible>
    Content
</Visible>
```
