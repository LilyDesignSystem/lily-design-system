# Care Card — Implementation Plan

## Goal

Implement the Care Card component: a medical care instruction card with urgency levels.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .care-card

## Approach

1. Use semantic <div> element with class="care-card"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="care-card"
- [ ] `role="region"` -- identifies the card as a named landmark
- [ ] `aria-label` -- set from `label` prop or `heading` prop for screen reader identification
- [ ] Keyboard: None -- this component is a passive content container
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
