# Avatar Image — Implementation Plan

## Goal

Implement the Avatar Image component: an avatar indicator inside image such as a user photo.

## HTML Tag and CSS Class

- HTML tag: <img>
- CSS class: .avatar-image

## Approach

1. Use semantic <img> element with class="avatar-image"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <img> with class="avatar-image"
- [ ] When inside an Avatar, the parent's `aria-label` provides the primary accessible name
- [ ] Keyboard: None -- this is a decorative/informational element, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
