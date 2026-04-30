# Hero

A large box or image with a title and description.

## Canonical documentation

See [components/hero/index.md](../../../components/hero/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/hero/macro.njk" import hero %}

{{ hero({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
