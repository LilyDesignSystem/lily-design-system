# Separator — Implementation Plan

## Goal

Implement the Separator component: a horizontal or vertical divider between content sections.

## HTML Tag and CSS Class

- HTML tag: <hr>
- CSS class: .separator

## Approach

1. Use semantic <hr> element with class="separator"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <hr> with class="separator"
- [ ] `role="separator"` -- explicitly identifies the element as a separator between sections of content
- [ ] `aria-label={label}` -- optional descriptive label for the separator, announced by screen readers when present
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
