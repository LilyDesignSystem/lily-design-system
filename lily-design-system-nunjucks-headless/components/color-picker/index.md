# ColorPicker

A two-dimensional board for picking colors by hue and saturation.

## Canonical documentation

See [components/color-picker/index.md](../../../components/color-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/color-picker/macro.njk" import colorPicker %}

{{ colorPicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
