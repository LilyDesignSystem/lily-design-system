# MedicalBannerBoxForDanger

A medical record banner box for danger information e.g. reactions, warnings, alarms, etc..

## Canonical documentation

See [components/medical-banner-box-for-danger/index.md](../../../components/medical-banner-box-for-danger/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/medical-banner-box-for-danger/macro.njk" import medicalBannerBoxForDanger %}

{{ medicalBannerBoxForDanger({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
