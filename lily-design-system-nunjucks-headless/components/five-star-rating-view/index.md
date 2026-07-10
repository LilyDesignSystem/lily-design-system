# FiveStarRatingView

A read-only display of a five-star rating.

## Canonical documentation

See [components/five-star-rating-view/index.md](../../../components/five-star-rating-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/five-star-rating-view/macro.njk" import fiveStarRatingView %}

{{ fiveStarRatingView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
