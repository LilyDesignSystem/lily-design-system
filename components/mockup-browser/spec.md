# MockupBrowser — Specification

Single source of truth for spec-driven development of the MockupBrowser component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the MockupBrowser component: a box area that looks like a web browser.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .mockup-browser

## Approach

1. Use semantic <div> element with class="mockup-browser"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="mockup-browser"
- [ ] `role="img"` -- presents the mockup as a decorative image
- [ ] `aria-label` -- describes the mockup content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .mockup-browser to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (mockup-browser.html)
- [ ] Implement HTML headless test (mockup-browser.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
