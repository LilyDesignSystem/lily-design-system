# CollectionList — Specification

Single source of truth for spec-driven development of the CollectionList component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the CollectionList component: a compact list of multiple related items such as articles or events.

## HTML Tag and CSS Class

- HTML tag: <ul>
- CSS class: .collection-list

## Approach

1. Use semantic <ul> element with class="collection-list"
2. Conditionally add aria-label when the optional label prop is provided
3. Render `collection-list-item` children
4. Pass through additional HTML attributes
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ul> with class="collection-list"
- [ ] aria-label is rendered only when label is provided
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add canonical entry to components.tsv and AGENTS/components.md

### In Progress

- [ ] Cross-check implementations against the canonical spec

### Backlog

- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Nunjucks headless component
- [ ] Implement Blazor headless component
- [ ] Add CSS class .collection-list to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
