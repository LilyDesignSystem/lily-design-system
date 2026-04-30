# DateInput

An input for entering a date value <input type="date">.

## Canonical documentation

See [components/date-input/index.md](../../../components/date-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/date-input/macro.njk" import dateInput %}

{{ dateInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
