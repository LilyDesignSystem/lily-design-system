# Submit Input — Specification

Single source of truth for spec-driven development of the Submit Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Submit Input component: a button input that submits a form <input type="submit">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .submit-input

## Approach

1. Use semantic <input> element with class="submit-input"
2. Implement keyboard navigation
3. Add vanilla JavaScript for interactive behavior
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="submit-input"
- [ ] Keyboard: Enter: activates the submit button
- [ ] Keyboard: Space: activates the submit button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .submit-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (submit-input.html)
- [ ] Implement HTML headless test (submit-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
