# TreeSelect — Specification

Single source of truth for spec-driven development of the TreeSelect component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the TreeSelect component: a select dropdown showing a tree of hierarchical options.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tree-select

## Approach

1. Use semantic <div> container with role="combobox" and class="tree-select"
2. Apply aria-haspopup="tree", aria-expanded, aria-label, and aria-multiselectable when multiple
3. Render <button class="tree-select-trigger" type="button"> with the trigger label/value/placeholder
4. Render <div class="tree-select-panel"> for the dropdown content
5. Toggle panel visibility with the hidden attribute based on expanded
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div role="combobox"> with class="tree-select"
- [ ] Trigger and panel have correct classes and behavior
- [ ] aria-haspopup, aria-expanded, aria-label, aria-multiselectable, disabled, hidden applied correctly
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
- [ ] Add CSS class .tree-select to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with TreeNav/TreeList children
