# Menu Bar — Specification

Single source of truth for spec-driven development of the Menu Bar component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Menu Bar component: a horizontal bar of menu triggers.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .menu-bar

## Dependencies

- Requires children: menu-bar-button

## Approach

1. Use semantic <div> element with class="menu-bar"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="menu-bar"
- [ ] `role="menubar"` -- identifies the container as a horizontal menu bar widget.
- [ ] `aria-label` -- provides an accessible name describing the purpose of the menu bar.
- [ ] Child elements should use `role="menuitem"` with `tabindex="-1"` for focusable menu bar items.
- [ ] Keyboard: ArrowRight: Moves focus to the next menu bar item, wrapping to the first item from the last.
- [ ] Keyboard: ArrowLeft: Moves focus to the previous menu bar item, wrapping to the last item from the first.
- [ ] Keyboard: Home: Moves focus to the first menu bar item.
- [ ] Keyboard: End: Moves focus to the last menu bar item.
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .menu-bar to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (menu-bar.html)
- [ ] Implement HTML headless test (menu-bar.test.js)
- [ ] Implement child component: menu-bar-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
