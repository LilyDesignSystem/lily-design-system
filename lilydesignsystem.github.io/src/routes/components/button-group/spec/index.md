# ButtonGroup — Specification

Single source of truth for spec-driven development of the ButtonGroup component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ButtonGroup component: a wrapper that groups related buttons together.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .button-group

## Approach

1. Use semantic <div> element with class="button-group" and role="group"
2. Apply aria-label from the required label prop
3. Render consumer-supplied buttons as children
4. Pass through additional HTML attributes
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="button-group" and role="group"
- [ ] aria-label equals the label prop
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
- [ ] Add CSS class .button-group to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
