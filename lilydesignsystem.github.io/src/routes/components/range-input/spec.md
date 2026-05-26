# Range Input — Specification

Single source of truth for spec-driven development of the Range Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Range Input component: a slider input for selecting a value within a range <input type="range">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .range-input

## Approach

1. Use semantic <input> element with class="range-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="range-input"
- [ ] `aria-label={label}` -- provides the accessible name for the slider control since no visible label element is associated
- [ ] Keyboard: Left Arrow / Down Arrow: decrease value by one step
- [ ] Keyboard: Right Arrow / Up Arrow: increase value by one step
- [ ] Keyboard: Home: set to minimum value
- [ ] Keyboard: End: set to maximum value
- [ ] Keyboard: Page Down: decrease by a larger step (browser-defined)
- [ ] Keyboard: Page Up: increase by a larger step (browser-defined)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .range-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (range-input.html)
- [ ] Implement HTML headless test (range-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
