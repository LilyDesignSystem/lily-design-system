# PopconfirmDialog — Specification

Single source of truth for spec-driven development of the PopconfirmDialog component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the PopconfirmDialog component: a popover dialog with confirm and cancel buttons.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .popconfirm-dialog

## Approach

1. Use semantic <div> container with role="alertdialog", aria-modal="false", class="popconfirm-dialog"
2. Generate stable ids for title and description elements
3. Render <h2 class="popconfirm-dialog-title"> with the title prop
4. Render optional <p class="popconfirm-dialog-description"> with the description prop
5. Wire aria-labelledby and aria-describedby to the matching ids
6. Render cancel and confirm buttons with type="button" and the supplied labels
7. Toggle the container hidden attribute from the open prop
8. Implement in HTML headless (plain HTML + minimal JS)
9. Implement in Svelte headless (Svelte 5 + runes)
10. Implement in React headless (React 19 + TypeScript)
11. Implement in Vue headless (Vue 3 + TypeScript)
12. Implement in Nunjucks headless (macro)
13. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div class="popconfirm-dialog" role="alertdialog">
- [ ] aria-labelledby/aria-describedby wired correctly to title and optional description ids
- [ ] Cancel and confirm buttons have correct classes and labels
- [ ] Container is hidden when open is false
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
- [ ] Add CSS class .popconfirm-dialog to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
