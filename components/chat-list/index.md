# Chat List

A chat list is an ordered list of chat list item components that displays a sequence of chat conversations. It provides the list structure within a ChatNav navigation container, organizing individual ChatListItem entries in chronological or priority order.

This headless component uses the native HTML `<ol>` element for inherent ordered list semantics. It is designed to be placed inside a ChatNav component and to contain ChatListItem children.

## Implementation Notes

- Renders an `<ol>` element for ordered list semantics
- Consumer places ChatListItem components as children
- Each ChatListItem typically contains a ChatMessage component
- Spreads `restProps` onto the `<ol>` for consumer customization

## Props

- `children`: slot (required) -- ChatListItem components
- `...restProps`: unknown -- additional attributes spread onto the `<ol>` element

## Usage

```html
<ChatNav label="Chat conversations">
  <ChatList>
    <ChatListItem>
      <ChatMessage>...</ChatMessage>
    </ChatListItem>
    <ChatListItem>
      <ChatMessage>...</ChatMessage>
    </ChatListItem>
  </ChatList>
</ChatNav>
```

## Keyboard Interactions

- Tab: Focus moves between interactive elements within the list items
- (Keyboard interactions are primarily handled by child ChatListItem components)

## ARIA

- Implicit `list` role from `<ol>` element
- Implicit `listitem` role from child `<li>` elements
- Ordered list conveys sequential relationship of chat entries

## When to Use

- Use inside a ChatNav component to display an ordered list of chat conversations.
- Use when chat entries have a meaningful order (e.g., most recent first, or chronological).
- Use when each entry in the list wraps a ChatListItem containing a ChatMessage.

## When Not to Use

- Do not use outside of a ChatNav context -- ChatList expects to be part of the ChatNav composition pattern.
- Do not use for non-chat ordered lists -- use ContentsList for page sections or TimelineList for chronological events.

## Headless

This component provides an `<ol>` element with ordered list semantics and zero visual styling. The consumer is responsible for all CSS including list reset, spacing between items, scroll behavior, and responsive layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.chat-list` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<ol>` element with class `chat-list`
- Verify implicit list role from `<ol>` element
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Remove default list styling (bullets, padding) and design a clean vertical list layout. Consider scroll behavior for long conversation lists and visual grouping for related conversations.
- **Developers**: Place ChatList inside a ChatNav component. Each child should be a ChatListItem containing a ChatMessage component.

## Composition

ChatList is part of the ChatNav composition pattern:

- **ChatNav** -- outer `<nav>` container providing the navigation landmark and accessible label.
- **ChatList** -- `<ol>` list conveying the ordered relationship of chat entries.
- **ChatListItem** -- individual `<li>` items, each typically containing a ChatMessage component.
- **ChatMessage** -- `<article>` element displaying one chat message with author, time, and content.

## References

- MDN HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
