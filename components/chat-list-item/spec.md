# Chat List Item — Specification

Single source of truth for spec-driven development of the Chat List Item component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ChatListItem component: one chat list item component, typically containing one chat message component.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .chat-list-item

## Approach

1. Use semantic <li> element with class="chat-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="chat-list-item"
- [ ] `aria-current` when the `current` prop is provided
- [ ] Keyboard: Tab: Focus the interactive element within the list item
- [ ] Keyboard: Enter: Activate the focused list item or link
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .chat-list-item to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (chat-list-item.html)
- [ ] Implement HTML headless test (chat-list-item.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
