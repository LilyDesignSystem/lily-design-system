# NetPromoterScoreView

A read-only display of a Net Promoter Score.

See `components/net-promoter-score-view/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `net-promoter-score-view`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<NetPromoterScoreView Label="...">
    Content
</NetPromoterScoreView>
```
