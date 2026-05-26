# Splitter — Implementation Plan

## Goal

Implement the Splitter component: a draggable divider for resizing adjacent panels.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .splitter

## Approach

1. Use semantic <div> element with class="splitter"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="splitter"
- [ ] `role="separator"` -- identifies the element as a separator between two regions
- [ ] `aria-label={label}` -- provides an accessible name describing the splitter's purpose
- [ ] `aria-orientation={orientation}` -- indicates whether the separator divides content horizontally or vertically
- [ ] `aria-valuenow={50}` -- reports the current position of the splitter as a percentage
- [ ] `aria-valuemin={0}` -- the minimum allowed position value
- [ ] `aria-valuemax={100}` -- the maximum allowed position value
- [ ] Keyboard: Tab: Moves focus to the splitter
- [ ] Keyboard: Arrow keys: Consumer should implement arrow key handling to adjust the split position (Left/Right for horizontal, Up/Down for vertical)
- [ ] Keyboard: Home: Consumer should implement to set the splitter to the minimum position
- [ ] Keyboard: End: Consumer should implement to set the splitter to the maximum position
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
