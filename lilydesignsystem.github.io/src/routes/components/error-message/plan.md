# Error Message — Implementation Plan

## Goal

Implement the Error Message component: an error message associated with a form field.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .error-message

## Approach

1. Use semantic <span> element with class="error-message"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="error-message"
- [ ] `role="alert"` -- creates an assertive live region so the error message is announced immediately by screen readers when it appears
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
