# Five Face Rating Picker — Specification

Single source of truth for spec-driven development of the Five Face Rating Picker component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Five Face Rating Picker component: a picker for selecting a 1-5 satisfaction rating using face labels.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .five-face-rating-picker

## Dependencies

- Requires children: five-face-rating-picker-button

## Companion Component

- five-face-rating-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="five-face-rating-picker"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="five-face-rating-picker"
- [ ] `role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- [ ] `aria-label="..."` -- provides an accessible name for the entire rating group
- [ ] Keyboard: Tab: focus the selected radio (or first if none selected)
- [ ] Keyboard: ArrowDown / ArrowRight: move to next radio button
- [ ] Keyboard: ArrowUp / ArrowLeft: move to previous radio button
- [ ] Keyboard: Space: select the focused radio button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .five-face-rating-picker to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (five-face-rating-picker.html)
- [ ] Implement HTML headless test (five-face-rating-picker.test.js)
- [ ] Implement child component: five-face-rating-picker-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: five-face-rating-view
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
