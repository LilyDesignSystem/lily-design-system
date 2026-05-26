# Tab Bar — Implementation Plan

## Goal

Implement the Tab Bar component: a group of tabs for switching between content panels.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tab-bar

## Dependencies

- Requires children: tab-bar-button

## Approach

1. Use semantic <div> element with class="tab-bar"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tab-bar"
- [ ] `role="tablist"` -- identifies the container as a list of tabs
- [ ] `aria-label={label}` -- provides an accessible name for the tab list so screen readers announce its purpose
- [ ] Child tabs should have `role="tab"` and `aria-selected` attributes (managed by consumer)
- [ ] Associated tab panels should have `role="tabpanel"` with `aria-labelledby` pointing to the corresponding tab (managed by consumer)
- [ ] Keyboard: Arrow Right: Moves focus to the next tab; wraps from the last tab to the first
- [ ] Keyboard: Arrow Left: Moves focus to the previous tab; wraps from the first tab to the last
- [ ] Keyboard: Home: Moves focus to the first tab
- [ ] Keyboard: End: Moves focus to the last tab
- [ ] Keyboard: Tab: Moves focus into and out of the tab list (only one tab in the list is in the tab order at a time)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
