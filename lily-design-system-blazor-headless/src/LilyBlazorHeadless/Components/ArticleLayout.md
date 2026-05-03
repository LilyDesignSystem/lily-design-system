# ArticleLayout

A top-level article wrapper that sets CSS custom properties for content column widths.

See `components/article-layout/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `article-layout`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ArticleLayout>
    Content
</ArticleLayout>
```
