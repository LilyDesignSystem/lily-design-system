# BarcodeImage

A barcode image rendered from a consumer-supplied source URL and accessible alt text.

## Canonical documentation

See [components/barcode-image/index.md](../../../components/barcode-image/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/barcode-image/macro.njk" import barcodeImage %}

{{ barcodeImage({
  src: "/path/to/barcode.png",
  alt: "Order number 12345"
}) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook stories
