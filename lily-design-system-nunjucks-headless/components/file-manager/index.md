# FileManager

A file browser for navigating and managing files.

## Canonical documentation

See [components/file-manager/index.md](../../../components/file-manager/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/file-manager/macro.njk" import fileManager %}

{{ fileManager({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
