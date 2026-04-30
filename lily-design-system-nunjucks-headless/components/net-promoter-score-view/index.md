# NetPromoterScoreView

A read-only display of a Net Promoter Score.

## Canonical documentation

See [components/net-promoter-score-view/index.md](../../../components/net-promoter-score-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/net-promoter-score-view/macro.njk" import netPromoterScoreView %}

{{ netPromoterScoreView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
