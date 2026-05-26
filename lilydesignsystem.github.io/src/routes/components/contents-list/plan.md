# Contents List — Implementation Plan

## Goal

Implement the Contents List component: an ordered list of contents list item components.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .contents-list

## Dependencies

- Requires parent: contents-nav
- Requires children: contents-list-item

## Approach

1. Use semantic <ol> element with class="contents-list"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="contents-list"
- [ ] `aria-label={label}` -- provides an accessible name for the `<nav>` landmark, distinguishing it from other navigation regions on the page
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
