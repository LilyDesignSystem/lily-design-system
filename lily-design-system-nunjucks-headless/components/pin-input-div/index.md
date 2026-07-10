# PinInputDiv

A series of single-digit inputs for entering a PIN or OTP code.

## Canonical documentation

See [components/pin-input-div/index.md](../../../components/pin-input-div/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/pin-input-div/macro.njk" import pinInputDiv %}

{{ pinInputDiv({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
