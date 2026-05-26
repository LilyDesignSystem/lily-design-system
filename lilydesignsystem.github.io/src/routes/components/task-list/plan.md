# Task List — Implementation Plan

## Goal

Implement the Task List component: an ordered list of task list items.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .task-list

## Dependencies

- Requires children: task-list-item

## Approach

1. Use semantic <ol> element with class="task-list"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="task-list"
- [ ] `role="list"` explicitly marks as a list
- [ ] `aria-label` provides accessible name for the list
- [ ] Keyboard: None directly -- standard list navigation by screen readers
- [ ] Keyboard: Tab moves focus between interactive elements (checkboxes, links) within task items
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
