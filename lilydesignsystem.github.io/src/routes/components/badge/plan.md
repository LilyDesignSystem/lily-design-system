# Badge — Implementation Plan

## Goal

Implement the Badge component: a small label for counts, statuses, or categories.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .badge

## Approach

1. Use semantic <span> element with class="badge"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="badge"
- [ ] `role="status"` -- creates an ARIA live region for dynamic content announcements
- [ ] `aria-label` -- optional expanded context for screen readers beyond the visible text
- [ ] Keyboard: None -- badges are informational, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
