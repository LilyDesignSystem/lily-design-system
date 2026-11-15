# FiveStarRatingRadioInput

A radio input for one choice of a 1-5 star rating <input type="radio">.

See `components/five-star-rating-radio-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-star-rating-radio-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveStarRatingRadioInput Label="...">
    Content
</FiveStarRatingRadioInput>
```
