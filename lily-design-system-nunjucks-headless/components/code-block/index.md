# CodeBlock

A block of formatted code with optional line numbers and line highlighting.

## Canonical documentation

See [components/code-block/index.md](../../../components/code-block/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/code-block/macro.njk" import codeBlock %}

{{ codeBlock({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
