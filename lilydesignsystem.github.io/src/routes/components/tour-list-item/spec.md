# Tour List Item — Specification

Single source of truth for spec-driven development of the Tour List Item component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tour List Item component: one step in a tour guide list.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .tour-list-item

## Dependencies

- Requires parent: tour-list

## Approach

1. Use semantic <li> element with class="tour-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="tour-list-item"
- [ ] `role="group"` -- groups the step content semantically
- [ ] `aria-roledescription="step"` -- identifies the element as a tour step
- [ ] `aria-label` -- provides an accessible name, optionally including "Step N of M"
- [ ] `aria-current="step"` -- indicates the currently active step
- [ ] `aria-hidden="true"` -- hides inactive steps from assistive technology
- [ ] Keyboard: None directly -- keyboard interactions are managed by the parent TourGuideList and by interactive elements within step content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tour-list-item to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tour-list-item.html)
- [ ] Implement HTML headless test (tour-list-item.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
