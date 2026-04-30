# Code

An inline code span for displaying short code snippets within surrounding text.

## Canonical documentation

See [components/code/index.md](../../../components/code/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/code/macro.njk" import code %}

{{ code({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
