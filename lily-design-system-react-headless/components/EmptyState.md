# EmptyState

A container for "nothing here yet" content. The consumer supplies heading, text and actions; no icon is bundled.

## Props

- `className`: string (optional)
- `label`: string (optional) -- when given, adds `role="group"` and `aria-label`
- `children`: ReactNode
- `...restProps` -- spread onto the root `<div>`

## Usage

```tsx
<EmptyState label="Inbox empty">
  <h2>No messages</h2>
  <p>New messages will appear here.</p>
</EmptyState>
```

## ARIA

Not a live region. `role="group"` only when labelled.

## Related components

`InfoState`.
