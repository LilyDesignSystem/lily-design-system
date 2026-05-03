# FiveStarRatingPicker

A picker for selecting a 1-5 star rating using radio buttons.

See `components/five-star-rating-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-star-rating-picker`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveStarRatingPicker Label="...">
    Content
</FiveStarRatingPicker>
```
