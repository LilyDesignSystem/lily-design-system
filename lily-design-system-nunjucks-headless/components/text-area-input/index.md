# TextAreaInput

A multi-line text input area.

## Canonical documentation

See [components/text-area-input/index.md](../../../components/text-area-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/text-area-input/macro.njk" import textAreaInput %}

{{ textAreaInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
