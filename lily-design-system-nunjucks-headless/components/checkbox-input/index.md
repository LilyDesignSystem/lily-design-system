# CheckboxInput

A checkbox input for toggling a boolean value <input type="checkbox">.

## Canonical documentation

See [components/checkbox-input/index.md](../../../components/checkbox-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/checkbox-input/macro.njk" import checkboxInput %}

{{ checkboxInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
