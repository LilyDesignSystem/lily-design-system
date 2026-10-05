# EmptyState

a container for an empty list, search, or inbox, with consumer-supplied heading, text and action

## Implementation Notes

- Root `<div class="empty-state">`; when `label` is given it is `role="group"` with `aria-label`
- Not a live region; no icon

## Props

- `label`: string (optional)
- default slot: consumer content

## Usage

```vue
<EmptyState label="Inbox empty"><h2>No messages</h2></EmptyState>
```

## Keyboard Interactions

- None beyond native behaviour

Canonical documentation: ../../components (see the component's `components/{slug}/index.md`).
