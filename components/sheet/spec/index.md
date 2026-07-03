# Sheet — Specification

Single source of truth for spec-driven development of the Sheet component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Sheet component: a panel that slides in from a screen edge as an overlay.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .sheet

## Approach

1. Use semantic <div> element with class="sheet"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="sheet"
- [ ] `role="dialog"` -- identifies the sheet as a dialog window
- [ ] `aria-label={label}` -- provides an accessible name for the dialog
- [ ] `aria-modal="true"` -- indicates the dialog is modal, meaning content behind it is inert
- [ ] Keyboard: Escape: Closes the sheet by setting `open` to `false`
- [ ] Keyboard: Tab: Moves focus between focusable elements within the sheet (consumer should implement focus trapping)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .sheet to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (sheet.html)
- [ ] Implement HTML headless test (sheet.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
