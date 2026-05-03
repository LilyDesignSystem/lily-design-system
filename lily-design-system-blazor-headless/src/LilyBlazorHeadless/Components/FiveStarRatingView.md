# FiveStarRatingView

A read-only display of a five-star rating.

See `components/five-star-rating-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-star-rating-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveStarRatingView Label="...">
    Content
</FiveStarRatingView>
```
