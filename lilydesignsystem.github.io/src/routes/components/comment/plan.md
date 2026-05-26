# Comment -- Implementation Plan

## Goal

Implement the Comment component: a comment displays user discussions and user feedback.

## HTML Tag and CSS Class

- HTML tag: <article>
- CSS class: .comment

## Approach

1. Use semantic <article> element with class="comment"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <article> with class="comment"
- [ ] `aria-label` -- describes the comment for screen readers
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
