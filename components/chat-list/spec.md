# Chat List — Specification

Single source of truth for spec-driven development of the Chat List component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ChatList component: an ordered list of chat list item components.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .chat-list

## Approach

1. Use semantic <ol> element with class="chat-list"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="chat-list"
- [ ] Implicit `list` role from `<ol>` element
- [ ] Implicit `listitem` role from child `<li>` elements
- [ ] Keyboard: Tab: Focus moves between interactive elements
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .chat-list to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (chat-list.html)
- [ ] Implement HTML headless test (chat-list.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
