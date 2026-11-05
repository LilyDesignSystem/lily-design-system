# NetPromoterScorePicker

A picker for selecting a 0-10 Net Promoter Score.

See `components/net-promoter-score-picker/index.md` for canonical documentation.

Eleven native radios in the contract's `<div role="radiogroup">`.

## Parameters

- `Label`: string (required)
- `Value`, `ValueChanged`: `0` to `10`, two-way with `@bind-Value`
- `Name`: string, default `nps`
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<NetPromoterScorePicker Label="How likely are you to recommend us?" @bind-Value="score" />
```
