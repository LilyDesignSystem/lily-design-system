# Error Summary — Implementation Plan

## Goal

Implement the Error Summary component: a summary of all validation errors on a form.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .error-summary

## Approach

1. Use semantic <div> element with class="error-summary"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="error-summary"
- [ ] `role="alert"` -- creates a live region that announces content to screen readers when the summary appears
- [ ] `aria-labelledby={titleId}` -- associates the alert region with its heading for context
- [ ] Keyboard: **Tab**: Moves focus through the error links within the summary
- [ ] Keyboard: The container itself can receive programmatic focus via `element.focus()` due to `tabindex="-1"`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
