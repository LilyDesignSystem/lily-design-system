# Theme Select Option — Implementation Plan

## Goal

Implement the Theme Select Option component: one option in a theme select dropdown.

## HTML Tag and CSS Class

- HTML tag: <option>
- CSS class: .theme-select-option

## Dependencies

- Requires parent: theme-select

## Approach

1. Use semantic <option> element with class="theme-select-option"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <option> with class="theme-select-option"
- [ ] Keyboard: Arrow Up/Down: Navigates between options within the parent select (native browser behavior)
- [ ] Keyboard: Enter/Space: Selects the focused option (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
