# FiveFaceRatingPickerButton

A picker button for selecting a 1-5 satisfaction rating using face labels.

## Canonical documentation

See [components/five-face-rating-picker-button/index.md](../../../components/five-face-rating-picker-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/five-face-rating-picker-button/macro.njk" import fiveFaceRatingPickerButton %}

{{ fiveFaceRatingPickerButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
