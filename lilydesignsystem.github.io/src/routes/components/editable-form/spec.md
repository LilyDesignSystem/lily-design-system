# Editable Form — Specification

Single source of truth for spec-driven development of the Editable Form component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Editable Form component: a form wrapper for inline editing of content.

## HTML Tag and CSS Class

- HTML tag: <form>
- CSS class: .editable-form

## Approach

1. Use semantic <form> element with class="editable-form"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <form> with class="editable-form"
- [ ] `aria-label={label}` -- provides an accessible name for the form
- [ ] Keyboard: Enter: submits the form (native form behavior), exits edit mode, calls `onsubmit`
- [ ] Keyboard: Escape: cancels editing, exits edit mode, calls `oncancel`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .editable-form to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (editable-form.html)
- [ ] Implement HTML headless test (editable-form.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
