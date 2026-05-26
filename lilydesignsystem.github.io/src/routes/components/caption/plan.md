# Caption — Implementation Plan

## Goal

Implement the Caption component: a caption for a table or figure element.

## HTML Tag and CSS Class

- HTML tag: <caption>
- CSS class: .caption

## Approach

1. Use semantic <caption> element with class="caption"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <caption> with class="caption"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
