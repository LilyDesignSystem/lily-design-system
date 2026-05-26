# Kbd — Implementation Plan

## Goal

Implement the Kbd component: show keyboard shortcuts and key combinations in a styled inline element.

## HTML Tag and CSS Class

- HTML tag: <kbd>
- CSS class: .kbd

## Approach

1. Use semantic <kbd> element with class="kbd"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <kbd> with class="kbd"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
