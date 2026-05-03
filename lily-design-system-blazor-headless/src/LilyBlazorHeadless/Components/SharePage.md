# SharePage

A component for sharing the page on social media.

See `components/share-page/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `share-page`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SharePage Label="...">
    Content
</SharePage>
```
