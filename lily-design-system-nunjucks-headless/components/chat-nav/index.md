# ChatNav

A navigation container for chat information.

## Canonical documentation

See [components/chat-nav/index.md](../../../components/chat-nav/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/chat-nav/macro.njk" import chatNav %}

{{ chatNav({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
