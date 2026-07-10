# ScreenReaderSpan

A visually hidden span of text intended for screen readers to provide more descriptive labels.

## Canonical documentation

See [components/screen-reader-span/index.md](../../../components/screen-reader-span/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/screen-reader-span/macro.njk" import screenReaderSpan %}

{{ screenReaderSpan({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
