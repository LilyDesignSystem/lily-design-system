# IconListItem — Specification

Single source of truth for spec-driven development of the IconListItem component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the IconListItem component: one item in an icon list with a leading icon slot.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .icon-list-item

## Approach

1. Use semantic <li> element with class="icon-list-item"
2. Render optional leading <span class="icon-list-item-icon" aria-hidden="true"> with the icon slot
3. Render text content inside <span class="icon-list-item-text">
4. Pass through additional HTML attributes
5. Implement in HTML headless (plain HTML)
6. Implement in Svelte headless (Svelte 5 + runes, snippet for icon)
7. Implement in React headless (React 19 + TypeScript, ReactNode for icon)
8. Implement in Vue headless (Vue 3 + TypeScript, named slot for icon)
9. Implement in Nunjucks headless (macro with caller pattern)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="icon-list-item"
- [ ] Icon span renders only when icon is provided and has aria-hidden="true"
- [ ] Text span has class="icon-list-item-text" and contains the children
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
- [ ] Add CSS class .icon-list-item to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
