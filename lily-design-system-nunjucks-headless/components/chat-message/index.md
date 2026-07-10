# ChatMessage

A chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc..

## Canonical documentation

See [components/chat-message/index.md](../../../components/chat-message/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/chat-message/macro.njk" import chatMessage %}

{{ chatMessage({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
