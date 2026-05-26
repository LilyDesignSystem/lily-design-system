# ScreenReaderSpan — Specification

Single source of truth for spec-driven development of the ScreenReaderSpan component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ScreenReaderSpan component: a visually hidden span of text intended for screen readers to provide more descriptive labels.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .screen-reader-span

## Approach

1. Use semantic <span> element with class="screen-reader-span"
2. Apply visually-hidden CSS pattern
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="screen-reader-span"
- [ ] Content is in the accessibility tree
- [ ] Content is visually hidden
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .screen-reader-span to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (screen-reader-span.html)
- [ ] Implement HTML headless test (screen-reader-span.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
