# EmailInput

An input for entering an email address <input type="email">.

## Canonical documentation

See [components/email-input/index.md](../../../components/email-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/email-input/macro.njk" import emailInput %}

{{ emailInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
