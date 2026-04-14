# Chat List Item

A chat list item is one chat list item component, typically containing one chat message component. It represents a single entry in a ChatList, providing the list item semantics for an individual chat conversation preview.

This headless component uses the native HTML `<li>` element for inherent list item semantics. It is designed to be placed inside a ChatList component and to contain a ChatMessage child.

## Implementation Notes

- Renders an `<li>` element for list item semantics
- Consumer places a ChatMessage component as a child
- Supports `current` prop for marking the currently selected conversation
- `aria-current` rendered when the `current` prop is provided
- Spreads `restProps` onto the `<li>` for consumer customization

## Props

- `current`: boolean (default: false) -- marks this item as the currently selected conversation
- `children`: slot (required) -- typically a ChatMessage component
- `...restProps`: unknown -- additional attributes spread onto the `<li>` element

## Usage

```html
<ChatNav label="Chat conversations">
  <ChatList>
    <ChatListItem current>
      <ChatMessage>...</ChatMessage>
    </ChatListItem>
    <ChatListItem>
      <ChatMessage>...</ChatMessage>
    </ChatListItem>
  </ChatList>
</ChatNav>
```

## Keyboard Interactions

- Tab: Focus the interactive element within the list item
- Enter: Activate the focused list item or link
- (Keyboard interactions are primarily handled by the interactive content within)

## ARIA

- Implicit `listitem` role from `<li>` element
- `aria-current="true"` when the `current` prop is provided, indicating the active conversation

## When to Use

- Use inside a ChatList component to represent one chat conversation entry.
- Use when each conversation needs to be selectable and navigable.
- Use with the `current` prop to mark the currently active conversation.

## When Not to Use

- Do not use outside of a ChatList context -- ChatListItem expects to be part of the ChatNav composition pattern.
- Do not use for non-chat list items -- use ContentsListItem for page section links or TimelineListItem for events.

## Headless

This component provides an `<li>` element with optional `aria-current` for the active conversation, with zero visual styling. The consumer is responsible for all CSS including layout, selected state styling, hover effects, and spacing.

## Styles

The consumer provides all CSS styling. The component renders with a `.chat-list-item` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<li>` element with class `chat-list-item`
- Verify `aria-current` is rendered when `current` prop is true
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide clear visual distinction between the selected conversation and others. Show hover and focus states. Consider showing unread message indicators, timestamps, and message previews.
- **Developers**: Use the `current` prop to mark the active conversation. Place a ChatMessage component as the child content.

## Composition

ChatListItem is part of the ChatNav composition pattern:

- **ChatNav** -- outer `<nav>` container providing the navigation landmark and accessible label.
- **ChatList** -- `<ol>` list conveying the ordered relationship of chat entries.
- **ChatListItem** -- individual `<li>` items, each typically containing a ChatMessage component.
- **ChatMessage** -- `<article>` element displaying one chat message with author, time, and content.

## References

- MDN HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
