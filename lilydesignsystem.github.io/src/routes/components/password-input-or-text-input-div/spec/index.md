# Password Input Or Text Input Div — Specification

Single source of truth for spec-driven development of the Password Input Or Text Input Div component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Password Input Or Text Input Div component: an input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .password-input-or-text-input-div

## Approach

1. Use semantic <div> element with class="password-input-or-text-input-div"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="password-input-or-text-input-div"
- [ ] `aria-label={label}` -- provides an accessible name for the password input
- [ ] `aria-label={toggleLabel}` -- provides an accessible name for the toggle button
- [ ] `aria-pressed={visible}` -- indicates whether the password is currently visible (on the toggle button)
- [ ] Keyboard: Enter/Space on the toggle button: Toggles password visibility between masked and plain text
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .password-input-or-text-input-div to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (password-input-or-text-input-div.html)
- [ ] Implement HTML headless test (password-input-or-text-input-div.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
