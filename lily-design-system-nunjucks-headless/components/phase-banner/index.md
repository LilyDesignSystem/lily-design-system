# PhaseBanner

A banner showing service development phase and inviting feedback.

## Canonical documentation

See [components/phase-banner/index.md](../../../components/phase-banner/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/phase-banner/macro.njk" import phaseBanner %}

{{ phaseBanner({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
