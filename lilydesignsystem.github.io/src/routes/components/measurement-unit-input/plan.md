# Measurement Unit Input — Implementation Plan

## Goal

Implement the Measurement Unit Input component: an input for selecting a measurement unit.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .measurement-unit-input

## Companion Component

- measurement-unit-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <input> element with class="measurement-unit-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="measurement-unit-input"
- [ ] `aria-label` -- set from the `label` prop to provide an accessible name
- [ ] Keyboard: Native `<input type="text">` keyboard behavior (typing, selection, clipboard)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
