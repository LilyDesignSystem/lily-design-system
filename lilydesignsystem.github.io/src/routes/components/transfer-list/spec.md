# TransferList — Specification

Single source of truth for spec-driven development of the TransferList component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the TransferList component: a dual list box for moving items between two lists.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .transfer-list

## Approach

1. Use semantic <div> container with role="group" and class="transfer-list"
2. Apply aria-label from the required label prop
3. Render the source slot inside <section class="transfer-list-source" aria-label={sourceLabel}>
4. Render the target slot inside <section class="transfer-list-target" aria-label={targetLabel}>
5. Render optional actions slot inside <div class="transfer-list-actions">
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes; named snippets)
8. Implement in React headless (React 19 + TypeScript; render-prop or slot props)
9. Implement in Vue headless (Vue 3 + TypeScript; named slots)
10. Implement in Nunjucks headless (macro with caller blocks)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div class="transfer-list" role="group">
- [ ] Source and target sections rendered with correct classes and aria-labels
- [ ] Actions slot renders only when provided
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base classes plus consumer extras
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
- [ ] Add CSS class .transfer-list to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with listbox source/target slots
