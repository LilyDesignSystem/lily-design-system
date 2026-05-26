# Tab Bar Button — Specification

Single source of truth for spec-driven development of the Tab Bar Button component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tab Bar Button component: one tab button in a tab group.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .tab-bar-button

## Dependencies

- Requires parent: tab-bar

## Approach

1. Use semantic <button> element with class="tab-bar-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="tab-bar-button"
- [ ] `role="tab"` identifies this as a tab
- [ ] `aria-selected` communicates selection state
- [ ] `aria-controls` links to the corresponding tabpanel
- [ ] Keyboard: TabBarButton: moves focus to the selected tab in the tablist
- [ ] Keyboard: ArrowLeft/ArrowRight: moves between tabs (handled by parent tablist)
- [ ] Keyboard: Enter/Space: activates the tab (native button behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tab-bar-button to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tab-bar-button.html)
- [ ] Implement HTML headless test (tab-bar-button.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
