# MockupShell

A box area that looks like a terminal shell.

## Canonical documentation

See [components/mockup-shell/index.md](../../../components/mockup-shell/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/mockup-shell/macro.njk" import mockupShell %}

{{ mockupShell({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
