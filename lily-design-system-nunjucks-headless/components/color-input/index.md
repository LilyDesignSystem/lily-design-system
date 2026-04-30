# ColorInput

An input for selecting a color value <input type="color">.

## Canonical documentation

See [components/color-input/index.md](../../../components/color-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/color-input/macro.njk" import colorInput %}

{{ colorInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
