# GoToPreviousSection

A link that takes users to the previous section of the current page.

## Canonical documentation

See [components/go-to-previous-section/index.md](../../../components/go-to-previous-section/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/go-to-previous-section/macro.njk" import goToPreviousSection %}

{{ goToPreviousSection({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
