# SignaturePad

A drawing area for capturing a handwritten signature.

## Canonical documentation

See [components/signature-pad/index.md](../../../components/signature-pad/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/signature-pad/macro.njk" import signaturePad %}

{{ signaturePad({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
