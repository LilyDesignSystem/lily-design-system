# ResetInput

A button input that resets a form to default values <input type="reset">.

## Canonical documentation

See [components/reset-input/index.md](../../../components/reset-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/reset-input/macro.njk" import resetInput %}

{{ resetInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
