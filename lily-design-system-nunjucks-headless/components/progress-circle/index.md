# ProgressCircle

A circular progress indicator.

## Canonical documentation

See [components/progress-circle/index.md](../../../components/progress-circle/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/progress-circle/macro.njk" import progressCircle %}

{{ progressCircle({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
