# File Upload — Specification

Single source of truth for spec-driven development of the File Upload component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the File Upload component: a drag-and-drop area for uploading files.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .file-upload

## Approach

1. Use semantic <div> element with class="file-upload"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="file-upload"
- [ ] `aria-label="..."` -- provides an accessible name for the upload button
- [ ] `aria-live="polite"` -- on the status span, announces file selection count without interrupting the user
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .file-upload to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (file-upload.html)
- [ ] Implement HTML headless test (file-upload.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
