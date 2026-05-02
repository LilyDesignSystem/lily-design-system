# ChatListItem

One chat list item, typically containing a chat message.

## Props

- `className`: string (optional) -- CSS class appended to `chat-list-item`
- `label`: string (optional) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<li>`

## Usage

```tsx
<ChatListItem>...</ChatListItem>
```

## References

- HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
