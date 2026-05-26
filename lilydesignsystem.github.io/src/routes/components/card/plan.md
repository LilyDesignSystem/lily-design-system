# Card — Implementation Plan

## Goal

Implement the Card component: a grouped content container with header, body, and footer areas.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .card

## Approach

1. Use semantic <div> element with class="card"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="card"
- [ ] Optional `aria-label` -- identifies the card as a named landmark for screen readers
- [ ] Keyboard: Tab: Focus the heading link when `href` is provided
- [ ] Keyboard: Enter: Activate the heading link (browser default)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
