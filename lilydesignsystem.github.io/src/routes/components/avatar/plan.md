# Avatar — Implementation Plan

## Goal

Implement the Avatar component: an avatar indicator that shows an avatar image or avatar text.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .avatar

## Approach

1. Use semantic <div> element with class="avatar"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="avatar"
- [ ] `role="img"` -- on the outer container, conveying that the entire avatar is an image representation
- [ ] `aria-label` -- set from the `alt` prop, providing the accessible name for the avatar
- [ ] `aria-hidden="true"` -- on the inner initials `<span>`, preventing duplicate announcements since the outer element already has `aria-label`
- [ ] Keyboard: None -- this is a decorative/informational component, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
