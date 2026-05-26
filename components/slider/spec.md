# Slider — Specification

Single source of truth for spec-driven development of the Slider component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Slider component: a draggable control for selecting a value along a track.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .slider

## Approach

1. Use semantic <div> element with class="slider"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="slider"
- [ ] `aria-label={label}` -- provides an accessible name for the slider
- [ ] Keyboard: Left Arrow / Down Arrow: Decrease value by one step
- [ ] Keyboard: Right Arrow / Up Arrow: Increase value by one step
- [ ] Keyboard: Home: Set to minimum value
- [ ] Keyboard: End: Set to maximum value
- [ ] Keyboard: Page Up: Increase by a larger step (browser-dependent)
- [ ] Keyboard: Page Down: Decrease by a larger step (browser-dependent)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .slider to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (slider.html)
- [ ] Implement HTML headless test (slider.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
