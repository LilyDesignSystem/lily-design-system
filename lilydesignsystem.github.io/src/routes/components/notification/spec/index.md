# Notification — Specification

Single source of truth for spec-driven development of the Notification component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Notification component: a brief message about an event or update.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .notification

## Approach

1. Use semantic <div> element with class="notification"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="notification"
- [ ] `role="status"` -- applied by default for non-urgent notifications; politely announces content changes
- [ ] `role="alert"` -- applied when `urgent` is true; assertively interrupts the user
- [ ] `aria-label="..."` -- provides an accessible name for the notification region
- [ ] `aria-live="polite"` -- default live region politeness; waits for user idle before announcing
- [ ] `aria-live="assertive"` -- applied when `urgent` is true; announces immediately
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .notification to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (notification.html)
- [ ] Implement HTML headless test (notification.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
