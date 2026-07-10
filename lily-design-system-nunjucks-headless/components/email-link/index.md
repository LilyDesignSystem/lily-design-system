# EmailLink

A mailto hyperlink for an email address.

## Canonical documentation

See [components/email-link/index.md](../../../components/email-link/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/email-link/macro.njk" import emailLink %}

{{ emailLink({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
