# IconButton — Implementation Plan

## Goal

Implement the IconButton component: a button containing only an icon with a required accessible label.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .icon-button

## Approach

1. Use semantic <button> element with class="icon-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard interaction (where applicable)
4. Add vanilla JavaScript for interactive behavior (where applicable)
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="icon-button"
- [ ] Required ARIA attributes are set
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
