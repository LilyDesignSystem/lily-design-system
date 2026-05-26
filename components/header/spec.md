# Header — Specification

Single source of truth for spec-driven development of the Header component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Header component: a page or section header area.

## HTML Tag and CSS Class

- HTML tag: <header>
- CSS class: .header

## Approach

1. Use semantic <header> element with class="header"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <header> with class="header"
- [ ] `aria-label={label}` -- optionally provides an accessible name for the header landmark, useful when multiple headers exist on a page to help screen reader users distinguish between them
- [ ] The `<header>` element implicitly has `role="banner"` when it is a direct child of `<body>`, providing a page-level landmark
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .header to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (header.html)
- [ ] Implement HTML headless test (header.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
