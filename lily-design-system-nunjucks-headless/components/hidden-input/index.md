# HiddenInput

A hidden input for including data in form submission <input type="hidden">.

## Canonical documentation

See [components/hidden-input/index.md](../../../components/hidden-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/hidden-input/macro.njk" import hiddenInput %}

{{ hiddenInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
