# FileInput

An input for selecting files from the file system <input type="file">.

## Canonical documentation

See [components/file-input/index.md](../../../components/file-input/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/file-input/macro.njk" import fileInput %}

{{ fileInput({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
