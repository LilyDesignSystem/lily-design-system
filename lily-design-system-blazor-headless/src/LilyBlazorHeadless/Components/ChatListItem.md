# ChatListItem

One chat list item component, typically containing one chat message component.

See `components/chat-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `chat-list-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ChatListItem>
    Content
</ChatListItem>
```
