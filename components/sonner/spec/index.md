# Sonner — Specification

Single source of truth for spec-driven development of the Sonner component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Sonner component: a toast notification manager.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .sonner

## Approach

1. Use semantic <div> element with class="sonner"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="sonner"
- [ ] `role="region"` -- defines the notification area as a named landmark section
- [ ] `aria-label={label}` -- provides an accessible name identifying the notification area
- [ ] `aria-live="polite"` -- ensures new content is announced after the screen reader finishes its current output
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .sonner to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (sonner.html)
- [ ] Implement HTML headless test (sonner.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
