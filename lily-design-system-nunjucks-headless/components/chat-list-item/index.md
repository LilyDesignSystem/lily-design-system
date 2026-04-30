# ChatListItem

One chat list item component, typically containing one chat message component.

## Canonical documentation

See [components/chat-list-item/index.md](../../../components/chat-list-item/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/chat-list-item/macro.njk" import chatListItem %}

{{ chatListItem({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
