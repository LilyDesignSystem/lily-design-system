# Emoji — Implementation Plan

## Goal

Implement the Emoji component: a single emoji character with accessible name.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .emoji

## Approach

1. Use semantic <span> element with class="emoji"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="emoji"
- [ ] `role="img"` -- identifies the emoji as an image for assistive technologies
- [ ] `aria-label` -- provides a textual description of the emoji character for screen readers
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
