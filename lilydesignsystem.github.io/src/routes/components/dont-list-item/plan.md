# Don't List Item — Implementation Plan

## Goal

Implement the Don't List Item component: a discouraged-practice item in a dont-list guideline list.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .dont-list-item

## Dependencies

- Requires parent: dont-list

## Approach

1. Use semantic <li> element with class="dont-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="dont-list-item"
- [ ] Keyboard: None directly -- standard list item with no interactive behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
