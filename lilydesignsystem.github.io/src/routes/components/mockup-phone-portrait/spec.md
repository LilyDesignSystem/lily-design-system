# Mockup Phone — Specification

Single source of truth for spec-driven development of the Mockup Phone component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the MockupPhonePortrait component: a box area that looks like a mobile phone.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .mockup-phone-portrait

## Approach

1. Use <div> element with class="mockup-phone-portrait" and role="img"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="mockup-phone-portrait"
- [ ] `role="img"` with `aria-label` identifies the phone frame
- [ ] Keyboard: Tab: Focus moves to interactive elements within the phone content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .mockup-phone-portrait to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (mockup-phone-portrait.html)
- [ ] Implement HTML headless test (mockup-phone-portrait.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
