# Timeline List Item — Implementation Plan

## Goal

Implement the Timeline List Item component: one event in a timeline list.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .timeline-list-item

## Dependencies

- Requires parent: timeline-list

## Approach

1. Use semantic <li> element with class="timeline-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="timeline-list-item"
- [ ] Keyboard: None directly -- standard list item navigation by screen readers
- [ ] Keyboard: Tab moves focus between any interactive elements (links, buttons) within the item
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
