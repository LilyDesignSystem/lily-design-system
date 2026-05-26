# Tag — Implementation Plan

## Goal

Implement the Tag component: a keyword label for categorizing content.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .tag

## Approach

1. Use semantic <span> element with class="tag"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="tag"
- [ ] `role="status"` -- identifies this as a live region for screen reader announcements of content changes
- [ ] `aria-label` -- provides an accessible name from the `label` prop, giving expanded context beyond the visible tag text
- [ ] Keyboard: None -- tags are informational, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
