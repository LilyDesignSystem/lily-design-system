# Chat Message

A chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, and message content. It represents a single message in a chat interface, providing semantic structure for messaging applications, customer support tools, and collaborative platforms.

This headless component uses the native HTML `<article>` element to represent a self-contained composition of a chat message. It is typically placed inside a ChatListItem component as part of the ChatNav composition pattern.

## Implementation Notes

- Renders an `<article>` element for self-contained message semantics
- Consumer provides author avatar, author name, timestamp, and message content as children
- `aria-label` provides an accessible description of the message (e.g. "Message from Alice at 10:30 AM")
- Supports a `<time>` element within the content for the message timestamp
- Spreads `restProps` onto the `<article>` for consumer customization

## Props

- `label`: string (optional) -- accessible label override for the message
- `children`: slot (required) -- message content including avatar, author name, time, and text
- `...restProps`: unknown -- additional attributes spread onto the `<article>` element

## Usage

A patient messaging conversation in a healthcare portal:

```html
<ChatNav label="Patient messages">
  <ChatList>
    <ChatListItem>
      <ChatMessage label="Message from Dr Sarah Mitchell at 10:30 AM">
        <Avatar>
          <AvatarImage src="/photos/sm.jpg" alt="Dr Sarah Mitchell" />
        </Avatar>
        <span>Dr Sarah Mitchell</span>
        <time datetime="2025-03-15T10:30:00">10:30 AM</time>
        <p>Your blood test results are back. Everything looks normal.</p>
      </ChatMessage>
    </ChatListItem>
    <ChatListItem current>
      <ChatMessage label="Message from Karen Francis at 10:45 AM">
        <Avatar>
          <AvatarImage src="/photos/kf.jpg" alt="Karen Francis" />
        </Avatar>
        <span>Karen Francis</span>
        <time datetime="2025-03-15T10:45:00">10:45 AM</time>
        <p>Thank you, doctor. Should I book a follow-up?</p>
      </ChatMessage>
    </ChatListItem>
  </ChatList>
</ChatNav>
```

## Keyboard Interactions

- Tab: Focus moves to interactive elements within the message (links, buttons)
- (The article element itself is not typically focusable)

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` provides an accessible description of the message
- `<time>` element with `datetime` attribute for machine-readable timestamps

## When to Use

- Use to display one message in a chat conversation, including author avatar, name, timestamp, and message content.
- Use inside a ChatListItem as part of the ChatNav composition pattern for conversation lists.
- Use in standalone chat thread views for displaying message history.
- Use when building real-time or asynchronous messaging interfaces.

## When Not to Use

- Do not use for comments on content such as articles or clinical notes -- use Comment instead.
- Do not use for system notifications or alerts -- use Alert or Notification.
- Do not use for log entries or event history -- use TimelineList.

## Headless

This component provides an `<article>` element with optional `aria-label` for message description, with zero visual styling. The consumer is responsible for all CSS including avatar positioning, message bubble styling, timestamp formatting, author name layout, and sent/received message alignment.

## Styles

The consumer provides all CSS styling. The component renders with a `.chat-message` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<article>` element with class `chat-message`
- Verify `aria-label` for accessible message description
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Visually distinguish sent and received messages with different alignment or bubble colors. Show avatars, author names, and timestamps consistently. Ensure message text has sufficient contrast and readable font size.
- **Developers**: Always provide a descriptive `label` prop (e.g., "Message from Alice at 10:30 AM") for screen reader context. Use semantic `<time>` elements with `datetime` attributes for timestamps.

## Composition

ChatMessage is part of the ChatNav composition pattern:

- **ChatNav** -- outer `<nav>` container providing the navigation landmark and accessible label.
- **ChatList** -- `<ol>` list conveying the ordered relationship of chat entries.
- **ChatListItem** -- individual `<li>` items, each typically containing a ChatMessage component.
- **ChatMessage** -- `<article>` element displaying one chat message with author, time, and content.

## References

- MDN HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
