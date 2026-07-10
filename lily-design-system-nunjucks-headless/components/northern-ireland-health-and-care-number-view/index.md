# NorthernIrelandHealthAndCareNumberView

A read-only display of Northern Ireland Health and Care (H&C) Number unique national healthcare identifier.

## Canonical documentation

See [components/northern-ireland-health-and-care-number-view/index.md](../../../components/northern-ireland-health-and-care-number-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/northern-ireland-health-and-care-number-view/macro.njk" import northernIrelandHealthAndCareNumberView %}

{{ northernIrelandHealthAndCareNumberView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
