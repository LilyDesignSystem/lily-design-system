# Banner — Specification

Single source of truth for spec-driven development of the Banner component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Banner component: a prominent message bar across the top of a page.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .banner

## Approach

1. Use semantic <div> element with class="banner"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="banner"
- [ ] `role="region"` -- establishes the banner as a landmark region for assistive technology navigation
- [ ] `aria-live="polite"` -- ensures screen readers announce banner content without interrupting the current reading
- [ ] `aria-label={closeLabel}` -- provides the accessible name for the dismiss button when present
- [ ] Keyboard: Tab: Focus the dismiss button (when `dismissible` is `true`)
- [ ] Keyboard: Enter/Space: Activate the dismiss button to hide the banner
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .banner to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (banner.html)
- [ ] Implement HTML headless test (banner.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
