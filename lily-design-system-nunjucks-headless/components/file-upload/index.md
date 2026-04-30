# FileUpload

A drag-and-drop area for uploading files.

## Canonical documentation

See [components/file-upload/index.md](../../../components/file-upload/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/file-upload/macro.njk" import fileUpload %}

{{ fileUpload({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
