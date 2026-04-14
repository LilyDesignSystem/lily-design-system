# Chat Nav

A chat nav is a navigation container for chat information that provides a landmark for a list of chat conversations. It allows users to browse, select, and navigate between chat conversations in messaging interfaces, customer support tools, and collaborative platforms.

ChatNav is a compound component. It provides the parent container structure (a `<nav>`), while the chat list and individual chat entries are rendered using the ChatList and ChatListItem components. Each ChatListItem typically contains a ChatMessage component showing the conversation preview.

## Implementation Notes

- Renders a `<nav>` element for the navigation landmark
- `aria-label` on the `<nav>` provides an accessible name (e.g. "Chat conversations")
- Consumer places ChatList component and ChatListItem components as children
- Each ChatListItem typically contains a ChatMessage component
- Spreads `restProps` onto the `<nav>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the navigation landmark
- `children`: slot (required) -- ChatList with ChatListItem components
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element

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

- Tab: Focus moves between interactive elements in the chat list
- Enter: Activates the focused chat list item or link
- Arrow Down: Move focus to the next chat list item
- Arrow Up: Move focus to the previous chat list item

## ARIA

- `<nav>` with `aria-label` creates a navigation landmark for the chat list
- `<ol>` conveys the ordered relationship of the chat entries
- Implicit `listitem` role from semantic `<li>` elements
- `aria-current` on the currently selected chat item

## When to Use

- Use as a navigation landmark for chat conversations in messaging applications, customer support interfaces, or collaborative platforms.
- Use when users need to browse and select between multiple chat threads.
- Use when conversations should be listed in a navigable, ordered structure with `aria-current` support.
- Use when the chat interface needs a semantic `<nav>` landmark for screen reader users.

## When Not to Use

- Do not use for non-chat navigation -- use ContentsNav for page sections or TreeNav for hierarchical navigation.
- Do not use for a single conversation thread -- render ChatList directly without the `<nav>` wrapper.
- Do not use for displaying system notifications -- use Alert or Notification instead.

## Headless

This component provides a `<nav>` landmark with `aria-label` containing an `<ol>` for ordered chat entries, with zero visual styling. The consumer is responsible for all CSS including chat item layout, active/selected states, unread indicators, avatar positioning, and responsive design.

## Styles

The consumer provides all CSS styling. The component renders with a `.chat-nav` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<nav>` element with class `chat-nav`
- Verify `<nav>` with `aria-label` creates a navigation landmark
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Show clear visual distinction between read and unread conversations. Display the most recent message preview and timestamp for each chat entry. Ensure the currently selected conversation is visually highlighted.
- **Developers**: Always provide a descriptive `label` prop (e.g., "Chat conversations") for the navigation landmark. Use `aria-current` on the currently active chat item.

## Composition

ChatNav follows the Nav / List / ListItem composition pattern:

- **ChatNav** -- outer `<nav>` container providing the navigation landmark and accessible label.
- **ChatList** -- `<ol>` list conveying the ordered relationship of chat entries.
- **ChatListItem** -- individual `<li>` items, each typically containing a ChatMessage component.
- **ChatMessage** -- `<article>` element displaying one chat message with author, time, and content.

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

## References

- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/patterns/landmark/
