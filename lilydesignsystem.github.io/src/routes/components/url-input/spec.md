# URL Input — Specification

Single source of truth for spec-driven development of the URL Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the URL Input component: an input for entering a URL <input type="url">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .url-input

## Approach

1. Use semantic <input> element with class="url-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="url-input"
- [ ] `aria-label={label}` -- provides the accessible name for the URL input since no visible label element is associated
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .url-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (url-input.html)
- [ ] Implement HTML headless test (url-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
