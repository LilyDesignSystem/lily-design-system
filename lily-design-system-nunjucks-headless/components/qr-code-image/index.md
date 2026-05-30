# QrCodeImage

A QR code image generated from text or URL data.

## Canonical documentation

See [components/qr-code-image/index.md](../../../components/qr-code-image/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/qr-code-image/macro.njk" import qrCodeImage %}

{{ qrCodeImage({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
