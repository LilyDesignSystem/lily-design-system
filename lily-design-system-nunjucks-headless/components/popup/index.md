# Popup

A temporary overlay that appears above page content.

## Canonical documentation

See [components/popup/index.md](../../../components/popup/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/popup/macro.njk" import popup %}

<button type="button" aria-haspopup="dialog" aria-controls="confirm"
        command="toggle-popover" commandfor="confirm" popovertarget="confirm">Delete</button>
{% call popup({ id: "confirm", label: "Confirm deletion" }) %}
  <p>Delete this item?</p>
{% endcall %}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
