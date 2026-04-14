# Comment

A comment displays user discussions and user feedback, typically including the author's name, avatar, timestamp, and the comment text. Comments are used in discussion threads, review sections, and feedback areas.

This headless component uses an `<article>` element for self-contained content semantics, with appropriate ARIA attributes for author and timestamp metadata.

## Implementation Notes

- Uses `<article>` element for self-contained comment semantics
- `aria-label` describes the comment (e.g., "Comment by Jane Doe")
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

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the comment for screen readers

## When to Use

- Use to display user discussions and feedback on content, such as clinical notes, patient feedback, or article comments.
- Use when each comment includes author, timestamp, and content.
- Use for threaded reply structures via recursive composition of nested Comment components.

## When Not to Use

- Do not use for real-time chat messages -- use ChatMessage instead.
- Do not use for system log entries or event history -- use TimelineList.
- Do not use for system-generated messages or alerts -- use Notification or Alert.

## Headless

This component provides an `<article>` element with optional `aria-label` for accessible comment identification, with zero visual styling. The consumer is responsible for all CSS including layout, avatar positioning, author name styling, timestamp formatting, and thread indentation for replies.

## Styles

The consumer provides all CSS styling. The component renders with a `.comment` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<article>` element with class `comment`
- Verify `aria-label` is applied when provided
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Clearly distinguish comment author, timestamp, and body text. Use indentation or threading to show reply hierarchies. Provide visual separation between comments.
- **Developers**: Use the `label` prop to identify the comment author for screen readers. Nest Comment components for threaded reply structures.
