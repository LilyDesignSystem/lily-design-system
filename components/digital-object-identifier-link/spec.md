# Digital Object Identifier Link — Specification

Single source of truth for spec-driven development of the Digital Object Identifier Link component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the DigitalObjectIdentifierLink component: a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .digital-object-identifier-link

## Approach

1. Use semantic <a> element with class="digital-object-identifier-link"
2. Construct href from DOI using https://doi.org/ resolver prefix
3. Add ARIA attributes for accessibility
4. Implement keyboard navigation
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="digital-object-identifier-link"
- [ ] `href` correctly constructed as `https://doi.org/{doi}`
- [ ] `rel="noopener noreferrer"` for external link security
- [ ] Keyboard: Tab: Focus the link
- [ ] Keyboard: Enter: Activate the link
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .digital-object-identifier-link to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (digital-object-identifier-link.html)
- [ ] Implement HTML headless test (digital-object-identifier-link.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
