# QrCode

A QR code image generated from text or URL data.

## Canonical documentation

See [components/qr-code/index.md](../../../components/qr-code/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/qr-code/macro.njk" import qrCode %}

{{ qrCode({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
