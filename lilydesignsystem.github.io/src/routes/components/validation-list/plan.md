# ValidationList — Implementation Plan

## Goal

Implement the ValidationList component: a live-feedback list of input validation rules with pending, passed, and failed states.

## HTML Tag and CSS Class

- HTML tag: <ul>
- CSS class: .validation-list

## Approach

1. Use semantic <ul> element with class="validation-list"
2. Set aria-label from the required label prop
3. Set aria-live="polite" so status changes are announced
4. Render `validation-list-item` children
5. Pass through additional HTML attributes
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ul> with class="validation-list"
- [ ] aria-label equals the label prop
- [ ] aria-live="polite" is set on the list
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
