# NavigationMenu

A site-wide navigation menu with links.

## Canonical documentation

See [components/navigation-menu/index.md](../../../components/navigation-menu/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/navigation-menu/macro.njk" import navigationMenu %}

{{ navigationMenu({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
