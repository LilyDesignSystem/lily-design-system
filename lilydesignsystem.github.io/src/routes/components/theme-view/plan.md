# Theme View — Implementation Plan

## Goal

Implement the Theme View component: a read-only display of the current theme.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .theme-view

## Approach

1. Use semantic <div> element with class="theme-view"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="theme-view"
- [ ] `aria-label={label}` -- provides an accessible name describing what the displayed value represents
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
