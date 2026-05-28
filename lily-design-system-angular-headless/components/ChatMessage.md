# ChatMessage

a chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc.

This is the Angular headless implementation. See `components/chat-message/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-chat-message></lily-chat-message>
```

## Files

- `ChatMessage.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ChatMessage.spec.ts` — vitest + TestBed render test
