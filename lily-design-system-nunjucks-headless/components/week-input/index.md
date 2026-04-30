# WeekInput

An input for selecting a week and year <input type="week">.

## Canonical documentation

See [components/week-input/index.md](../../../components/week-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/week-input/macro.njk" import weekInput %}

{{ weekInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
