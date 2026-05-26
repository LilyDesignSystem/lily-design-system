# Radio Group — Specification

Single source of truth for spec-driven development of the Radio Group component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Radio Group component: a group of radio buttons for selecting one option.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .radio-group

## Dependencies

- Requires children: radio-input

## Approach

1. Use semantic <div> element with class="radio-group"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="radio-group"
- [ ] `role="radiogroup"` -- identifies the fieldset as a group of radio buttons
- [ ] `aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose
- [ ] Keyboard: Tab: Moves focus into the radio group; within the group, arrow keys move between radio buttons (native browser behavior)
- [ ] Keyboard: Arrow Up / Arrow Down: Moves selection between radio buttons within the group (native radio behavior)
- [ ] Keyboard: Space: Selects the focused radio button (native radio behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .radio-group to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (radio-group.html)
- [ ] Implement HTML headless test (radio-group.test.js)
- [ ] Implement child component: radio-input

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
