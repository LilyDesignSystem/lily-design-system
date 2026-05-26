# Flair — Implementation Plan

## Goal

Implement the Flair component: a decorative highlight or emphasis element.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .flair

## Approach

1. Use semantic <span> element with class="flair"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="flair"
- [ ] `aria-hidden="true"` -- applied when no `label` is provided, marking the flair as decorative
- [ ] `aria-label` -- applied when `label` is provided, giving the flair an accessible name for screen readers
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
