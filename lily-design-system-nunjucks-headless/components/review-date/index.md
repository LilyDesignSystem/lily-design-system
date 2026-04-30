# ReviewDate

A display of a content review date.

## Canonical documentation

See [components/review-date/index.md](../../../components/review-date/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/review-date/macro.njk" import reviewDate %}

{{ reviewDate({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
