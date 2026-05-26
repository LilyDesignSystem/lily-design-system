# Field — Specification

Single source of truth for spec-driven development of the Field component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Field component: a form field wrapper with label, input, and error message.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .field

## Approach

1. Use semantic <div> element with class="field"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="field"
- [ ] `role="alert"` -- on the error paragraph, announces the error message to screen readers
- [ ] `aria-hidden="true"` -- on the required asterisk, prevents screen readers from reading the decorative indicator
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .field to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (field.html)
- [ ] Implement HTML headless test (field.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
