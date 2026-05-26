# Chat Nav -- Implementation Plan

## Goal

Implement the ChatNav component: a navigation container for chat information.

## HTML Tag and CSS Class

- HTML tag: <nav>
- CSS class: .chat-nav

## Approach

1. Use semantic <nav> element with class="chat-nav"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <nav> with class="chat-nav"
- [ ] `aria-label` on the `<nav>` provides an accessible name
- [ ] `aria-current` on the currently selected chat item
- [ ] Keyboard: Tab: Focus moves between interactive elements
- [ ] Keyboard: Enter: Activates the focused chat list item
- [ ] Keyboard: Arrow Down: Move focus to the next chat list item
- [ ] Keyboard: Arrow Up: Move focus to the previous chat list item
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
