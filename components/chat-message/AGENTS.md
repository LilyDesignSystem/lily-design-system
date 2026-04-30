# ChatMessage

## Metadata

- Component: chat-message
- PascalCase: ChatMessage
- Description: a chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc.
- HTML tag: <article>
- CSS class: .chat-message
- Interactive: no

## Composition

- Pattern: Nav/List/ListItem
- Parent: chat-list-item

## Key Behaviors

- Renders an `<article>` element for self-contained message semantics
- Consumer provides author avatar, author name, timestamp, and message content as children
- `aria-label` provides an accessible description of the message
- Supports a `<time>` element within the content for the message timestamp
- Spreads `restProps` onto the `<article>` for consumer customization

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` provides an accessible description of the message
- `<time>` element with `datetime` attribute for machine-readable timestamps

## Keyboard

- Tab: Focus moves to interactive elements within the message (links, buttons)
- (The article element itself is not typically focusable)

## Props

- `label`: string (optional) -- accessible label override for the message
- `children`: slot (required) -- message content including avatar, author name, time, and text
- `...restProps`: unknown -- additional attributes spread onto the `<article>` element

## Acceptance Criteria

- [ ] Renders <article> element with class="chat-message"
- [ ] Has aria-label attribute when provided
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .chat-message in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/chat-message.html
- MDN HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
