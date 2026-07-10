# UnitedStatesSocialSecurityNumberView

A read-only display of a US Social Security number.

## Canonical documentation

See [components/united-states-social-security-number-view/index.md](../../../components/united-states-social-security-number-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/united-states-social-security-number-view/macro.njk" import unitedStatesSocialSecurityNumberView %}

{{ unitedStatesSocialSecurityNumberView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
