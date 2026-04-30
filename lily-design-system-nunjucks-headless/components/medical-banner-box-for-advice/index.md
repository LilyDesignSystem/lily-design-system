# MedicalBannerBoxForAdvice

A medical record banner box for advice information e.g. contacts, contexts, plans, etc..

## Canonical documentation

See [components/medical-banner-box-for-advice/index.md](../../../components/medical-banner-box-for-advice/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/medical-banner-box-for-advice/macro.njk" import medicalBannerBoxForAdvice %}

{{ medicalBannerBoxForAdvice({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
