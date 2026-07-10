# Notification

A brief message about an event or update.

## Canonical documentation

See [components/notification/index.md](../../../components/notification/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/notification/macro.njk" import notification %}

{{ notification({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
