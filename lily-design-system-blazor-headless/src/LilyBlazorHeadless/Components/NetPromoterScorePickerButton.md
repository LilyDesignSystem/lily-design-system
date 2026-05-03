# NetPromoterScorePickerButton

A picker button for selecting a 0-10 Net Promoter Score.

See `components/net-promoter-score-picker-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `net-promoter-score-picker-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NetPromoterScorePickerButton Label="...">
    Content
</NetPromoterScorePickerButton>
```
