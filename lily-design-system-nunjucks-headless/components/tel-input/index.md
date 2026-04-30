# TelInput

An input for entering a telephone number <input type="tel">.

## Canonical documentation

See [components/tel-input/index.md](../../../components/tel-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tel-input/macro.njk" import telInput %}

{{ telInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
