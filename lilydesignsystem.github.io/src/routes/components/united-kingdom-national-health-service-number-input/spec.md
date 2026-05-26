# United Kingdom National Health Service Number Input — Specification

Single source of truth for spec-driven development of the United Kingdom National Health Service Number Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the United Kingdom National Health Service Number Input component: an input for entering a UK NHS number.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .united-kingdom-national-health-service-number-input

## Approach

1. Use semantic <input> element with class="united-kingdom-national-health-service-number-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="united-kingdom-national-health-service-number-input"
- [ ] `aria-label` provides accessible name from label prop
- [ ] Keyboard: Standard text input keyboard behavior
- [ ] Keyboard: Users type digits and spaces in the format XXX XXX XXXX
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .united-kingdom-national-health-service-number-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (united-kingdom-national-health-service-number-input.html)
- [ ] Implement HTML headless test (united-kingdom-national-health-service-number-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
