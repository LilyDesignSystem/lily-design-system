# TuaisceartEireannHealthAndCareNumberView

A read-only display of Tuaisceart Eireann Health and Care (H&C) Number unique national healthcare identifier.

## Canonical documentation

See [components/tuaisceart-eireann-health-and-care-number-view/index.md](../../../components/tuaisceart-eireann-health-and-care-number-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tuaisceart-eireann-health-and-care-number-view/macro.njk" import tuaisceartEireannHealthAndCareNumberView %}

{{ tuaisceartEireannHealthAndCareNumberView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
