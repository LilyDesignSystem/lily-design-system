# DescriptionList

A definition list displaying information in key-value format <dl>.

## Canonical documentation

See [components/description-list/index.md](../../../components/description-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/description-list/macro.njk" import descriptionList %}

{{ descriptionList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
