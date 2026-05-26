# Review Date — Implementation Plan

## Goal

Implement the Review Date component: a display of a content review date.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .review-date

## Approach

1. Use semantic <span> element with class="review-date"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="review-date"
- [ ] `aria-label` -- provides screen reader context from the `label` prop
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
