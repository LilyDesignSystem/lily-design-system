# ActionBarButton — Specification

Single source of truth for spec-driven development of the ActionBarButton component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ActionBarButton component: one action button inside an action bar.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .action-bar-button

## Approach

1. Use semantic <button> element with class="action-bar-button"
2. Add required aria-label from the label prop
3. Default type="button" to avoid accidental form submission
4. Forward disabled and onClick to the native button
5. Pass through any additional HTML attributes
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="action-bar-button"
- [ ] aria-label equals the label prop
- [ ] type defaults to "button"
- [ ] disabled attribute applied when disabled is true
- [ ] Click handler fires on Enter, Space, and click
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
- [ ] Add CSS class .action-bar-button to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests inside an action-bar parent
