# NetPromoterScorePicker

A picker for selecting a 0-10 Net Promoter Score.

See `components/net-promoter-score-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `net-promoter-score-picker`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NetPromoterScorePicker Label="...">
    Content
</NetPromoterScorePicker>
```
