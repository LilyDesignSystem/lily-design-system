# FiveFaceRatingRadioInput

A radio input for one choice of a 1-5 satisfaction rating <input type="radio">.

See `components/five-face-rating-radio-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-face-rating-radio-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveFaceRatingRadioInput Label="...">
    Content
</FiveFaceRatingRadioInput>
```
