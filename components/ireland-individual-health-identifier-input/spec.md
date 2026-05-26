# Ireland Individual Health Identifier Input — Specification

Single source of truth for spec-driven development of the Ireland Individual Health Identifier Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Ireland Individual Health Identifier Input component: an input for entering an Ireland Individual Health Identifier (IHI) unique national healthcare identifier.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .ireland-individual-health-identifier-input

## Approach

1. Use semantic <input> element with class="ireland-individual-health-identifier-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="ireland-individual-health-identifier-input"
- [ ] `aria-label` provides accessible name from label prop
- [ ] Pattern: `[0-9]{10}` (10 digits)
- [ ] `inputmode="numeric"` for numeric keyboard on mobile
- [ ] `autocomplete="off"` to protect sensitive health identifiers
- [ ] Keyboard: Standard text input keyboard behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Implement HTML headless component
- [x] Implement Svelte headless component
- [x] Implement React headless component
- [x] Implement Vue headless component

### In Progress

- [ ] Add CSS class .ireland-individual-health-identifier-input to css-style-sheet-template.css

### Backlog

- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
