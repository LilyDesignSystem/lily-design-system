# ThemePickerButton -- Implementation Plan

## Goal

Implement the ThemePickerButton component: a picker button for selecting a visual theme.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .theme-picker-button

## Approach

1. Use semantic <button> element with class="theme-picker-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="theme-picker-button"
- [ ] `aria-pressed` -- indicates selected state
- [ ] `aria-label` -- describes the theme
- [ ] Keyboard: Tab, Enter, Space
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
