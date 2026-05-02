# ChatList

An ordered list of chat list items.

## Props

- `className`: string (optional) -- CSS class appended to `chat-list`
- `label`: string (optional) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<ol>`

## Usage

```tsx
<ChatList>...</ChatList>
```

## References

- HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
