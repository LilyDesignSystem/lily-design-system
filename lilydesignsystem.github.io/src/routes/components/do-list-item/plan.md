# Do List Item — Implementation Plan

## Goal

Implement the Do List Item component: an encouraged-practice item in a do-list guideline list.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .do-list-item

## Dependencies

- Requires parent: do-list

## Approach

1. Use semantic <li> element with class="do-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="do-list-item"
- [ ] Keyboard: None directly -- standard list item with no interactive behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
