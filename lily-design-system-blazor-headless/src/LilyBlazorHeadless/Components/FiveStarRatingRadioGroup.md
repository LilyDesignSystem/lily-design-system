# FiveStarRatingRadioGroup

A fieldset radio group for selecting a 1-5 star rating.

See `components/five-star-rating-radio-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-star-rating-radio-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveStarRatingRadioGroup Label="...">
    Content
</FiveStarRatingRadioGroup>
```
