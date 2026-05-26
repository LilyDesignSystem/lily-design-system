# Button — Specification

Single source of truth for spec-driven development of the Button component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Button component: a generic clickable button element.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .button

## Approach

1. Use semantic <button> element with class="button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="button"
- [ ] `aria-pressed` for toggle button state (when provided)
- [ ] `aria-label` for screen reader text override
- [ ] `aria-disabled` from native disabled attribute
- [ ] Keyboard: Tab: Focus the button
- [ ] Keyboard: Enter: Activate the button
- [ ] Keyboard: Space: Activate the button
- [ ] Keyboard: (All handled natively by `<button>` element)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .button to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (button.html)
- [ ] Implement HTML headless test (button.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
