# Form — Specification

Single source of truth for spec-driven development of the Form component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Form component: a form element for collecting and submitting user data.

## HTML Tag and CSS Class

- HTML tag: <form>
- CSS class: .form

## Approach

1. Use semantic <form> element with class="form"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <form> with class="form"
- [ ] `aria-label="..."` -- provides an accessible name for the form, helping screen readers identify its purpose
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .form to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (form.html)
- [ ] Implement HTML headless test (form.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
