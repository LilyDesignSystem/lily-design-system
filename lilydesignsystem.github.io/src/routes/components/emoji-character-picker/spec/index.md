# Emoji Character Picker — Specification

Single source of truth for spec-driven development of the Emoji Character Picker component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Emoji Character Picker component: a picker for browsing and selecting emoji characters.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .emoji-character-picker

## Approach

1. Use semantic <div> element with class="emoji-character-picker"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="emoji-character-picker"
- [ ] `role="grid"` -- identifies the container as a grid widget for structured cell navigation
- [ ] `aria-label={label}` -- provides an accessible name for the emoji picker
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .emoji-character-picker to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (emoji-character-picker.html)
- [ ] Implement HTML headless test (emoji-character-picker.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
