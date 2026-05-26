# Task List Item — Implementation Plan

## Goal

Implement the Task List Item component: one task item with a checkbox and label.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .task-list-item

## Dependencies

- Requires parent: task-list

## Approach

1. Use semantic <li> element with class="task-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="task-list-item"
- [ ] Keyboard: None directly -- standard list item with no interactive behavior
- [ ] Keyboard: If the item contains interactive elements (checkboxes, links), they handle their own keyboard behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
