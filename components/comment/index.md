# Comment

A comment is anything that expresses an opinion, observation, explanation, etc. Examples include user discussion replies, peer review remarks, marginalia, code review notes, and editor annotations.

This headless component renders a `<div>` with class `comment`. The consumer supplies the comment body and any related metadata (author, timestamp, action buttons) as children.

## Implementation Notes

- Uses `<div>` element with class `comment`
- `aria-label` describes the comment for assistive technology (e.g., "Comment by Jane Doe")
- Contains slots for avatar, author name, timestamp, and body content
- Supports nested replies through recursive composition

## Props

- `label`: string (optional) -- accessible label for the comment
- `children`: slot (required) -- comment content including avatar, author, time, and body
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Comment label="Comment by Jane Doe">
  <Avatar>JD</Avatar>
  <span>Jane Doe</span>
  <time datetime="2025-01-15">January 15, 2025</time>
  <p>This is a great article! Thanks for sharing.</p>
</Comment>
```

## Keyboard Interactions

- None -- comments are informational, not interactive

## ARIA

- `aria-label` -- describes the comment for screen readers

## When to Use

- Use to display opinions, observations, or explanations from a user or contributor.
- Use when each comment includes author, timestamp, and content.
- Use for threaded reply structures via recursive composition of nested Comment components.

## When Not to Use

- Do not use for real-time chat messages -- use ChatMessage instead.
- Do not use for system log entries or event history -- use TimelineList.
- Do not use for system-generated messages or alerts -- use Notification or Alert.

## Headless

This component provides a `<div>` element with optional `aria-label` for accessible comment identification, with zero visual styling. The consumer is responsible for all CSS including layout, avatar positioning, author name styling, timestamp formatting, and thread indentation for replies.

## Styles

The consumer provides all CSS styling. The component renders with a `.comment` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `comment`
- Verify `aria-label` is applied when provided
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Clearly distinguish comment author, timestamp, and body text. Use indentation or threading to show reply hierarchies. Provide visual separation between comments.
- **Developers**: Use the `label` prop to identify the comment author for screen readers. Nest Comment components for threaded reply structures.

## Related components

- `question` — a question is anything that asks for information, invites a response, tests knowledge, etc.
- `answer` — an answer is anything that responds to a question, request, action, etc.
- `chat-message` — a chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc.
- `blockquote` — a block-level quotation with optional source citation

## References

- [MDN div element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)

---

Lily™ and Lily Design System™ are trademarks.
