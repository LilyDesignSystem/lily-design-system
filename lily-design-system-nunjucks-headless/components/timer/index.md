# Timer

A countdown or elapsed time display.

## Canonical documentation

See [components/timer/index.md](../../../components/timer/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/timer/macro.njk" import timer %}

{{ timer({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
