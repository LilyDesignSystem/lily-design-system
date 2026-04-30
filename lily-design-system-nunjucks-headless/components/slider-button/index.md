# SliderButton

A button with a slider that the user needs to slide to confirm.

## Canonical documentation

See [components/slider-button/index.md](../../../components/slider-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/slider-button/macro.njk" import sliderButton %}

{{ sliderButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
