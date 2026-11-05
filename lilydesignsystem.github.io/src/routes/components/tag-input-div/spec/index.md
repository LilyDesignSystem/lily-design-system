# Tag Input Div — Specification

Single source of truth for spec-driven development of the Tag Input Div component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tag Input Div component: an input for adding and removing tags.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tag-input-div

## Approach

1. Use a <div role="group"> element with class="tag-input-div", holding the consumer's tags and an <input class="tag-input-div-field">
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tag-input-div"
- [ ] `role="group"` and `aria-label={label}` on the root, and `aria-label={label}` on the field
- [ ] Keyboard: Enter: When the input has a non-empty trimmed value, prevents default form submission, calls `onadd` with the trimmed value, and clears the input
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tag-input-div to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tag-input-div.html)
- [ ] Implement HTML headless test (tag-input-div.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
