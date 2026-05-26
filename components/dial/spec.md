# Dial — Specification

Single source of truth for spec-driven development of the Dial component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Dial component: a rotary dial control for selecting a value.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .dial

## Approach

1. Use semantic <div> element with class="dial"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="dial"
- [ ] `role="slider"` -- indicates a range input control
- [ ] `aria-label="{label}"` -- provides an accessible name for the dial
- [ ] `aria-valuenow="{value}"` -- communicates the current value to assistive technology
- [ ] `aria-valuemin="{min}"` -- communicates the minimum allowed value
- [ ] `aria-valuemax="{max}"` -- communicates the maximum allowed value
- [ ] `aria-disabled="true"` -- present only when the dial is disabled
- [ ] Keyboard: ArrowRight / ArrowUp: increase value by one step
- [ ] Keyboard: ArrowLeft / ArrowDown: decrease value by one step
- [ ] Keyboard: Shift + ArrowRight / ArrowUp: increase value by 10 steps
- [ ] Keyboard: Shift + ArrowLeft / ArrowDown: decrease value by 10 steps
- [ ] Keyboard: Home: set value to minimum
- [ ] Keyboard: End: set value to maximum
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .dial to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (dial.html)
- [ ] Implement HTML headless test (dial.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
