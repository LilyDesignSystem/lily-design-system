# NetPromoterScorePicker

A picker for selecting a 0-10 Net Promoter Score.

## Canonical documentation

See [components/net-promoter-score-picker/index.md](../../../components/net-promoter-score-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/net-promoter-score-picker/macro.njk" import netPromoterScorePicker %}

{{ netPromoterScorePicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
