# Chat Nav — Specification

Single source of truth for spec-driven development of the Chat Nav component. Consolidates the prior `plan.md` and `tasks.md`.

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

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .chat-nav to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (chat-nav.html)
- [ ] Implement HTML headless test (chat-nav.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
