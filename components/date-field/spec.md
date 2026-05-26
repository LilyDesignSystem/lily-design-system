# Date Field — Specification

Single source of truth for spec-driven development of the Date Field component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Date Field component: a structured field for entering date components.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .date-field

## Approach

1. Use semantic <div> element with class="date-field"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="date-field"
- [ ] `aria-describedby={descriptionId}` -- links the input to its description text when present
- [ ] `aria-invalid="true"` -- indicates the input contains an invalid value when an error is present
- [ ] `aria-errormessage={errorId}` -- links the input to its error message when present
- [ ] `role="alert"` -- on the error paragraph, announces the error message to screen readers
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .date-field to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (date-field.html)
- [ ] Implement HTML headless test (date-field.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
