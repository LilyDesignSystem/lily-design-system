# Measurement Instance Input — Implementation Plan

## Goal

Implement the Measurement Instance Input component: an input for entering a measurement value and unit.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .measurement-instance-input

## Companion Component

- measurement-instance-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <input> element with class="measurement-instance-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="measurement-instance-input"
- [ ] `aria-label` -- set from the `label` prop to provide an accessible name
- [ ] Keyboard: Native `<input type="text">` keyboard behavior (typing, selection, clipboard)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
