# Contents List Item — Implementation Plan

## Goal

Implement the Contents List Item component: one contents list item component linking to a page section.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .contents-list-item

## Dependencies

- Requires parent: contents-list

## Approach

1. Use semantic <li> element with class="contents-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="contents-list-item"
- [ ] Supports `aria-current="page"` or `aria-current="true"` on the `<li>` for indicating the current page in a navigation context
- [ ] Keyboard: None directly -- keyboard interaction is handled by contained links or the parent list
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
