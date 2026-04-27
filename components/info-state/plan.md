# InfoState — Implementation Plan

## Goal

Implement the InfoState component: a composition of illustration, title, description, and action for empty, error, or info states.

## HTML Tag and CSS Class

- HTML tag: <section>
- CSS class: .info-state

## Approach

1. Use semantic <section> element with class="info-state"
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

- [ ] Renders <section> with class="info-state"
- [ ] Required ARIA attributes are set
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
