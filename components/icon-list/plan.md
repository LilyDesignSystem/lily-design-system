# IconList — Implementation Plan

## Goal

Implement the IconList component: an ordered list of icon list item components.

## HTML Tag and CSS Class

- HTML tag: <ul>
- CSS class: .icon-list

## Approach

1. Use semantic <ul> element with class="icon-list"
2. Conditionally add aria-label when the optional label prop is provided
3. Render `icon-list-item` children
4. Pass through additional HTML attributes
5. Implement in HTML headless (plain HTML)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ul> with class="icon-list"
- [ ] aria-label is rendered only when label is provided
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
