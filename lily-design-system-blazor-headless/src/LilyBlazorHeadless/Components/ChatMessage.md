# ChatMessage

A chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc..

See `components/chat-message/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `chat-message`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ChatMessage>
    Content
</ChatMessage>
```
