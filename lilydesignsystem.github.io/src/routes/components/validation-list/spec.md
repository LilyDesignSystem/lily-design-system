# ValidationList — Specification

Single source of truth for spec-driven development of the ValidationList component. Consolidates the prior `plan.md` and `tasks.md`.

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
- [ ] Add CSS class .validation-list to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests for aria-live announcements
- [ ] Add integration tests with form components
