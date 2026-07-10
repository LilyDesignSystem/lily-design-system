# MedicalBanner

A prominent message bar across the top of a page, with medical information.

## Canonical documentation

See [components/medical-banner/index.md](../../../components/medical-banner/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/medical-banner/macro.njk" import medicalBanner %}

{{ medicalBanner({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
