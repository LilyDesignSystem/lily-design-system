# Sheet

A panel that slides in from a screen edge as an overlay.

## Canonical documentation

See [components/sheet/index.md](../../../components/sheet/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/sheet/macro.njk" import sheet %}

{% call sheet({ id: "sheet-1", label: "…" }) %}
  <form method="dialog"><button>…</button></form>
{% endcall %}
```

It renders a closed `<dialog aria-modal="true">`. Open it with `document.getElementById("sheet-1").showModal()`: the browser makes the page behind it inert, keeps Tab inside, closes it on Escape and returns focus to the opener when it closes. Do not add the `open` attribute (that would show it non-modally); the `open` param is ignored.

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
