# Drawer — Implementation Plan

## Goal

Implement the Drawer component: a panel that slides in from the edge of the screen.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .drawer

## Approach

1. Use semantic <div> element with class="drawer"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="drawer"
- [ ] `role="dialog"` -- identifies the drawer as a dialog for assistive technology
- [ ] `aria-label={label}` -- provides an accessible name for the dialog
- [ ] `aria-modal="true"` -- indicates the drawer is modal, restricting interaction to its contents
- [ ] Keyboard: Escape: closes the drawer by setting `open` to `false`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
