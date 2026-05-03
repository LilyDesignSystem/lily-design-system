# FloatButton

A floating action button anchored to a viewport corner.

See `components/float-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `float-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FloatButton Label="...">
    Content
</FloatButton>
```
