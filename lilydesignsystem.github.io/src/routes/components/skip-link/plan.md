# Skip Link — Implementation Plan

## Goal

Implement the Skip Link component: a hidden link for keyboard users to skip to main content.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .skip-link

## Approach

1. Use semantic <a> element with class="skip-link"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="skip-link"
- [ ] Keyboard: Tab: Moves focus to the skip link (should be the first focusable element on the page)
- [ ] Keyboard: Enter: Activates the link, moving focus to the target anchor element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
