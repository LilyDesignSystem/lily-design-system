# TabBar

A group of tabs for switching between content panels.

See `components/tab-bar/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tab-bar`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TabBar Label="...">
    Content
</TabBar>
```
