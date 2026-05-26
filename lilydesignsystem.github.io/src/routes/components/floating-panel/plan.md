# Floating Panel — Implementation Plan

## Goal

Implement the Floating Panel component: a panel that floats above page content.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .floating-panel

## Approach

1. Use semantic <div> element with class="floating-panel"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="floating-panel"
- [ ] `role="region"` -- identifies the panel as a landmark region
- [ ] `aria-label="..."` -- provides an accessible name for the region
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
