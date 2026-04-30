# TableBody

A table interactive grid tbody <tbody>.

## Canonical documentation

See [components/table-body/index.md](../../../components/table-body/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/table-body/macro.njk" import tableBody %}

{{ tableBody({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
