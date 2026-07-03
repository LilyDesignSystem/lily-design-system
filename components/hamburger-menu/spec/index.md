# Hamburger Menu — Specification

Single source of truth for spec-driven development of the Hamburger Menu component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Hamburger Menu component: a toggle button that opens a mobile navigation menu.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .hamburger-menu

## Approach

1. Use semantic <button> element with class="hamburger-menu"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="hamburger-menu"
- [ ] `aria-label={label}` -- on the button, provides an accessible name for the toggle control
- [ ] `aria-expanded={open}` -- on the button, indicates whether the navigation panel is currently visible
- [ ] `aria-controls={menuId}` -- on the button, references the id of the navigation panel
- [ ] `role="navigation"` -- on the content container, identifies it as a navigation landmark
- [ ] `aria-label={label}` -- on the navigation container, provides an accessible name for the landmark
- [ ] Keyboard: Enter: Toggles the menu open/closed when the button has focus (native button behavior)
- [ ] Keyboard: Space: Toggles the menu open/closed when the button has focus (native button behavior)
- [ ] Keyboard: Tab: Moves focus to/from the toggle button and into the navigation content when open
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .hamburger-menu to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (hamburger-menu.html)
- [ ] Implement HTML headless test (hamburger-menu.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
