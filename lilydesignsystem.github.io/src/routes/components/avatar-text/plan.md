# Avatar Text — Implementation Plan

## Goal

Implement the Avatar Text component: an avatar indicator inner text such as a user name.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .avatar-text

## Approach

1. Use semantic <span> element with class="avatar-text"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="avatar-text"
- [ ] Typically marked `aria-hidden="true"` when inside an Avatar, since the parent's `aria-label` already provides the accessible name
- [ ] Keyboard: None -- this is a decorative/informational element, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
