# Contents Nav — Implementation Plan

## Goal

Implement the Contents Nav component: a navigation landmark for a list of contents.

## HTML Tag and CSS Class

- HTML tag: <nav>
- CSS class: .contents-nav

## Dependencies

- Requires children: contents-list, contents-list-item

## Approach

1. Use semantic <nav> element with class="contents-nav"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <nav> with class="contents-nav"
- [ ] `aria-label={label}` -- provides an accessible name for the `<nav>` landmark, distinguishing it from other navigation regions on the page
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
