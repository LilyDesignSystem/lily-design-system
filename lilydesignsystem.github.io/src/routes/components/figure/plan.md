# Figure — Implementation Plan

## Goal

Implement the Figure component: a self-contained figure with optional caption.

## HTML Tag and CSS Class

- HTML tag: <figure>
- CSS class: .figure

## Approach

1. Use semantic <figure> element with class="figure"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <figure> with class="figure"
- [ ] `role="img"` -- identifies the figure as a graphical image to assistive technologies
- [ ] `aria-label={label}` -- provides an accessible name describing the figure content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
