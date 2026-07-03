# Alert Dialog — Specification

Single source of truth for spec-driven development of the Alert Dialog component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Alert Dialog component: a modal dialog for urgent messages requiring user acknowledgment.

## HTML Tag and CSS Class

- HTML tag: <dialog>
- CSS class: .alert-dialog

## Approach

1. Use semantic <dialog> element with class="alert-dialog"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <dialog> with class="alert-dialog"
- [ ] `role="alertdialog"`
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby` references the title element
- [ ] `aria-describedby` references the description element (when present)
- [ ] Keyboard: Escape: Closes the dialog (consumer must implement via onkeydown)
- [ ] Keyboard: Tab: Focus should be trapped within the dialog (consumer responsibility)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .alert-dialog to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (alert-dialog.html)
- [ ] Implement HTML headless test (alert-dialog.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
