# MedicalBannerBox

A medical banner box that is inside a medical-banner component, using flexbox horizontal, with medical information.

## Canonical documentation

See [components/medical-banner-box/index.md](../../../components/medical-banner-box/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/medical-banner-box/macro.njk" import medicalBannerBox %}

{{ medicalBannerBox({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
