# Theme Picker — Implementation Plan

## Goal

Implement the Theme Picker component: a picker for selecting a visual theme.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .theme-picker

## Approach

1. Use semantic <div> element with class="theme-picker"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="theme-picker"
- [ ] `role="radiogroup"` -- identifies the fieldset as a group of related radio buttons
- [ ] `aria-label={label}` -- provides an accessible name describing the purpose of the theme selection
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
