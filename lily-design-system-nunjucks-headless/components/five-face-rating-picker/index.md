# FiveFaceRatingPicker

A picker for selecting a 1-5 satisfaction rating using face labels.

## Canonical documentation

See [components/five-face-rating-picker/index.md](../../../components/five-face-rating-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/five-face-rating-picker/macro.njk" import fiveFaceRatingPicker %}

{{ fiveFaceRatingPicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
