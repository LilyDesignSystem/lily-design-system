# UnitedStatesSocialSecurityNumberInput

An input for entering a US Social Security number.

## Canonical documentation

See [components/united-states-social-security-number-input/index.md](../../../components/united-states-social-security-number-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/united-states-social-security-number-input/macro.njk" import unitedStatesSocialSecurityNumberInput %}

{{ unitedStatesSocialSecurityNumberInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
