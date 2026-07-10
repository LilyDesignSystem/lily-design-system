# PasswordInputOrTextInputDiv

An input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle.

## Canonical documentation

See [components/password-input-or-text-input-div/index.md](../../../components/password-input-or-text-input-div/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/password-input-or-text-input-div/macro.njk" import passwordInputOrTextInputDiv %}

{{ passwordInputOrTextInputDiv({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
