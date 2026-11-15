# FiveFaceRatingRadioGroup

A fieldset radio group for selecting a 1-5 satisfaction rating using face labels.

See `components/five-face-rating-radio-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `five-face-rating-radio-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FiveFaceRatingRadioGroup Label="...">
    Content
</FiveFaceRatingRadioGroup>
```
