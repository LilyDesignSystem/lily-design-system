# FiveStarRatingPicker

A picker for selecting a 1-5 star rating using radio buttons.

## Canonical documentation

See [components/five-star-rating-picker/index.md](../../../components/five-star-rating-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/five-star-rating-picker/macro.njk" import fiveStarRatingPicker %}

{{ fiveStarRatingPicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
