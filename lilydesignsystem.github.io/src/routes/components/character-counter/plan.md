# Character Counter — Implementation Plan

## Goal

Implement the Character Counter component: a counter showing remaining or used characters in a text field.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .character-counter

## Approach

1. Use semantic <span> element with class="character-counter"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="character-counter"
- [ ] `role="status"` -- identifies the element as a live region that presents advisory information
- [ ] `aria-live="polite"` -- screen readers announce updates at the next convenient pause, without interrupting the user
- [ ] `aria-label` -- set from the `label` prop to provide context for what the counter represents
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
