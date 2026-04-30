# Avatar

An avatar indicator that shows an avatar image or avatar text.

## Canonical documentation

See [components/avatar/index.md](../../../components/avatar/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/avatar/macro.njk" import avatar %}

{{ avatar({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
