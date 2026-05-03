# ChatNav

A navigation container for chat information.

See `components/chat-nav/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `chat-nav`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ChatNav Label="...">
    Content
</ChatNav>
```
