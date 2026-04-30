# RangeInput

A slider input for selecting a value within a range <input type="range">.

## Canonical documentation

See [components/range-input/index.md](../../../components/range-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/range-input/macro.njk" import rangeInput %}

{{ rangeInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
