# United States Social Security Number Input — Specification

Single source of truth for spec-driven development of the United States Social Security Number Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the United States Social Security Number Input component: an input for entering a US Social Security number.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .united-states-social-security-number-input

## Approach

1. Use semantic <input> element with class="united-states-social-security-number-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="united-states-social-security-number-input"
- [ ] `aria-label` provides accessible name from label prop
- [ ] Keyboard: Standard text input keyboard behavior
- [ ] Keyboard: Users type digits and hyphens in the format XXX-XX-XXXX
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .united-states-social-security-number-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (united-states-social-security-number-input.html)
- [ ] Implement HTML headless test (united-states-social-security-number-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
