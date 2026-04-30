# TextInput

A single-line text input field <input type="text">.

## Canonical documentation

See [components/text-input/index.md](../../../components/text-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/text-input/macro.njk" import textInput %}

{{ textInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
