# Red Amber Green Picker — Specification

Single source of truth for spec-driven development of the Red Amber Green Picker component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Red Amber Green Picker component: a picker for selecting a red/amber/green status.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .red-amber-green-picker

## Dependencies

- Requires children: red-amber-green-picker-button

## Companion Component

- red-amber-green-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="red-amber-green-picker"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <fieldset role="radiogroup"> with class="red-amber-green-picker"
- [ ] `aria-label` on the fieldset from the label prop
- [ ] One native radio per status (red, amber, green), sharing one name
- [ ] Each option's text from `statusLabel`; no English default
- [ ] Keyboard: the native radio group's (arrows move and check, Space checks)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .red-amber-green-picker to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (red-amber-green-picker.html)
- [ ] Implement HTML headless test (red-amber-green-picker.test.js)
- [ ] Implement child component: red-amber-green-picker-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: red-amber-green-view
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
