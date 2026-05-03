# FiveFaceRatingView

A read-only display of a five-face satisfaction rating.

See `components/five-face-rating-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-face-rating-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveFaceRatingView Label="...">
    Content
</FiveFaceRatingView>
```
