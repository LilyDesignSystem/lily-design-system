# Chat Message -- Implementation Plan

## Goal

Implement the ChatMessage component: a chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc.

## HTML Tag and CSS Class

- HTML tag: <article>
- CSS class: .chat-message

## Approach

1. Use semantic <article> element with class="chat-message"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <article> with class="chat-message"
- [ ] `aria-label` provides an accessible description of the message
- [ ] `<time>` element with `datetime` attribute for timestamps
- [ ] Keyboard: Tab: Focus moves to interactive elements within the message
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
