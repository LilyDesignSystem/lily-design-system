# ClipboardCopyButton

A button that copies text to the clipboard.

## Canonical documentation

See [components/clipboard-copy-button/index.md](../../../components/clipboard-copy-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/clipboard-copy-button/macro.njk" import clipboardCopyButton %}

{{ clipboardCopyButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
