# FiveStarRatingPicker

A picker for selecting a 1-5 star rating using radio buttons.

## Canonical documentation

See [components/five-star-rating-picker/index.md](../../../components/five-star-rating-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

A `<fieldset role="radiogroup">` of native radios, as in every other catalog: the radios give the keys, form submission and form reset. Each option's text is `starLabels`, in order; without it, the numbers alone.

```njk
{% from "components/five-star-rating-picker/macro.njk" import fiveStarRatingPicker %}

{{ fiveStarRatingPicker({ label: "Rating", value: 3, starLabels: ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"] }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
