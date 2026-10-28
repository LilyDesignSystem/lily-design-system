# NavigationMenu

A site-wide navigation menu with links.

## Canonical documentation

See [components/navigation-menu/index.md](../../../components/navigation-menu/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/navigation-menu/macro.njk" import navigationMenu %}

{{ navigationMenu({ }) }}
```

Overflow mode (markup only; this library ships no client script, so the links wrap and the More item stays hidden until you add one):

```njk
{% call navigationMenu({ label: "Main", overflow: true, moreLabel: "More" }) %}
<li><a href="/">Home</a></li>
{% endcall %}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
