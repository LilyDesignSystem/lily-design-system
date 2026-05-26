# Skeleton — Implementation Plan

## Goal

Implement the Skeleton component: a placeholder loading animation for content.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .skeleton

## Approach

1. Use semantic <div> element with class="skeleton"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="skeleton"
- [ ] `aria-hidden="true"` -- hides the placeholder entirely from screen readers
- [ ] `aria-busy="true"` -- signals that this region is in a loading state and content will be replaced
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
