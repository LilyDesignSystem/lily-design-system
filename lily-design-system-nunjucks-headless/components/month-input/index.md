# MonthInput

An input for selecting a month and year <input type="month">.

## Canonical documentation

See [components/month-input/index.md](../../../components/month-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/month-input/macro.njk" import monthInput %}

{{ monthInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
