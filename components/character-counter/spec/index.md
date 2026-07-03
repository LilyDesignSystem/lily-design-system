# Character Counter — Specification

Single source of truth for spec-driven development of the Character Counter component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Character Counter component: a counter showing remaining or used characters in a text field.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .character-counter

## Approach

1. Use semantic <span> element with class="character-counter"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="character-counter"
- [ ] `role="status"` -- identifies the element as a live region that presents advisory information
- [ ] `aria-live="polite"` -- screen readers announce updates at the next convenient pause, without interrupting the user
- [ ] `aria-label` -- set from the `label` prop to provide context for what the counter represents
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .character-counter to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (character-counter.html)
- [ ] Implement HTML headless test (character-counter.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
