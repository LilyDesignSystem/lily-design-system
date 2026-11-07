# FiveFaceRatingPicker

A picker for selecting a 1-5 satisfaction rating using face labels.

## Canonical documentation

See [components/five-face-rating-picker/index.md](../../../components/five-face-rating-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

A `<fieldset role="radiogroup">` of native radios, as in every other catalog: the radios give the keys, form submission and form reset. Each option's text is `labels`, in order; without it, the numbers alone.

```njk
{% from "components/five-face-rating-picker/macro.njk" import fiveFaceRatingPicker %}

{{ fiveFaceRatingPicker({ label: "Rating", value: 3, labels: ["Very unhappy", "Unhappy", "Neutral", "Happy", "Very happy"] }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
