# Resizable — Implementation Plan

## Goal

Implement the Resizable component: a container that the user can resize by dragging.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .resizable

## Approach

1. Use semantic <div> element with class="resizable"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="resizable"
- [ ] `role="region"` -- identifies the container as a landmark region for assistive technologies
- [ ] `aria-label={label}` -- provides an accessible name describing the resizable area
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
