# ThemeView

A read-only display of the current theme.

See `components/theme-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `theme-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ThemeView Label="...">
    Content
</ThemeView>
```
