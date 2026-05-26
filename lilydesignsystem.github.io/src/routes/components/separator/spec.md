# Separator — Specification

Single source of truth for spec-driven development of the Separator component. Consolidates the prior `plan.md` and `tasks.md`.

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

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .separator to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (separator.html)
- [ ] Implement HTML headless test (separator.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
