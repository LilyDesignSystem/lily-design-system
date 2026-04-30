# MenuBarButton

One item in a menu bar.

## Canonical documentation

See [components/menu-bar-button/index.md](../../../components/menu-bar-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/menu-bar-button/macro.njk" import menuBarButton %}

{{ menuBarButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
