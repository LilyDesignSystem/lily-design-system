# Loading -- Implementation Plan

## Goal

Implement the Loading component: a loading indicator, such as text, or image, or animation.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .loading

## Approach

1. Use semantic <div> element with class="loading"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="loading"
- [ ] `role="status"` -- creates an ARIA live region for loading announcements
- [ ] `aria-live="polite"` -- announces changes without interrupting
- [ ] `aria-label` -- describes the loading state
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
