# TabPanel — Specification

Single source of truth for spec-driven development of the TabPanel component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the TabPanel component: a content panel associated with a tab in a tab bar.

## HTML Tag and CSS Class

- HTML tag: <div> with role="tabpanel"
- CSS class: .tab-panel

## Approach

1. Use a <div role="tabpanel" class="tab-panel" tabindex="0">
2. If `labelledBy` is provided, set aria-labelledby={labelledBy} and omit aria-label
3. Otherwise, set aria-label={label}
4. Apply the hidden attribute when `selected` is false
5. Render children inside the panel
6. Implement in HTML headless (plain HTML + vanilla JS)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div role="tabpanel"> with class="tab-panel"
- [ ] tabindex="0" is present
- [ ] aria-labelledby is set and aria-label is absent when labelledBy is provided
- [ ] aria-label is set and aria-labelledby is absent when labelledBy is not provided
- [ ] hidden reflects !selected
- [ ] Children render inside the panel
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
- [ ] Add CSS class .tab-panel to css-style-sheet-template.css
- [ ] Add tests for the labelledBy vs label branch
- [ ] Add integration tests with TabBar and TabBarButton siblings
