# MockupWindow

A box area that looks like a desktop window.

## Canonical documentation

See [components/mockup-window/index.md](../../../components/mockup-window/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/mockup-window/macro.njk" import mockupWindow %}

{{ mockupWindow({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
