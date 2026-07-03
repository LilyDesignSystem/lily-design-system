# Dialog — Specification

Single source of truth for spec-driven development of the Dialog component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Dialog component: a modal or non-modal dialog window.

## HTML Tag and CSS Class

- HTML tag: <dialog>
- CSS class: .dialog

## Approach

1. Use semantic <dialog> element with class="dialog"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <dialog> with class="dialog"
- [ ] `role="dialog"` -- provided natively by the `<dialog>` element
- [ ] `aria-label="{label}"` -- provides an accessible name for the dialog
- [ ] `aria-modal="true"` -- present when the `modal` prop is true, indicating the dialog traps focus and blocks background interaction
- [ ] Keyboard: Escape: closes the dialog by setting `open` to false
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .dialog to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (dialog.html)
- [ ] Implement HTML headless test (dialog.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
