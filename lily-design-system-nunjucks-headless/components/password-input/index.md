# PasswordInput

An input for entering a password with obscured text <input type="password">.

## Canonical documentation

See [components/password-input/index.md](../../../components/password-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/password-input/macro.njk" import passwordInput %}

{{ passwordInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
