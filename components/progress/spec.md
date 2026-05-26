# Progress — Specification

Single source of truth for spec-driven development of the Progress component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Progress component: a horizontal progress bar showing completion.

## HTML Tag and CSS Class

- HTML tag: <progress>
- CSS class: .progress

## Approach

1. Use semantic <progress> element with class="progress"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <progress> with class="progress"
- [ ] `aria-label={label}` -- provides an accessible name describing what process the progress bar represents
- [ ] The `<progress>` element implicitly has `role="Progress"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes managed by the browser
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .progress to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (progress.html)
- [ ] Implement HTML headless test (progress.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
