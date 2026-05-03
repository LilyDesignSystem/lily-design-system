# ActionBarButton

One action button inside an action bar.

See `components/action-bar-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `action-bar-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ActionBarButton Label="...">
    Content
</ActionBarButton>
```
