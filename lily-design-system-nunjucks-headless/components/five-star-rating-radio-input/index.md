# FiveStarRatingRadioInput

A radio input for one choice of a 1-5 star rating <input type="radio">.

## Canonical documentation

See [components/five-star-rating-radio-input/index.md](../../../components/five-star-rating-radio-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/five-star-rating-radio-input/macro.njk" import fiveStarRatingRadioInput %}

{{ fiveStarRatingRadioInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
