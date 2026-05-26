# SuperBanner — Specification

Single source of truth for spec-driven development of the SuperBanner component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the SuperBanner component: a super-banner communicates a high-priority state that affects an entire app, experience, process, or system.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .super-banner

## Approach

1. Use semantic <div> element with class="super-banner"
2. Add ARIA attributes for accessibility
3. Implement dismiss functionality
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="super-banner"
- [ ] `role="alert"` -- announces the banner content immediately
- [ ] `aria-live="assertive"` -- interrupts current speech
- [ ] Dismiss functionality works when dismissable
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .super-banner to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (super-banner.html)
- [ ] Implement HTML headless test (super-banner.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
