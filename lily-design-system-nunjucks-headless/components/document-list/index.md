# DocumentList

A list displaying documents with titles and metadata.

## Canonical documentation

See [components/document-list/index.md](../../../components/document-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/document-list/macro.njk" import documentList %}

{{ documentList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
