# ReviewDate

A display of a content review date.

## Canonical documentation

See [components/review-date/index.md](../../../components/review-date/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/review-date/macro.njk" import reviewDate %}

{{ reviewDate({ label: "Last reviewed", datetime: "2026-10-06", text: "6 October 2026" }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
