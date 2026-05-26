# Image — Implementation Plan

## Goal

Implement the Image component: an image element with alt text.

## HTML Tag and CSS Class

- HTML tag: <img>
- CSS class: .image

## Approach

1. Use semantic <img> element with class="image"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <img> with class="image"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
