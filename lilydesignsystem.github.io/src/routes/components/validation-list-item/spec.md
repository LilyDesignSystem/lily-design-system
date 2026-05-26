# ValidationListItem — Specification

Single source of truth for spec-driven development of the ValidationListItem component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ValidationListItem component: one validation rule in a validation list with a status of pending, passed, or failed.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .validation-list-item

## Approach

1. Use semantic <li> element with class="validation-list-item"
2. Default the status prop to "pending" and accept "pending" | "passed" | "failed"
3. Render data-status attribute equal to the status prop
4. Conditionally add aria-label when the optional label prop is provided
5. Render the children as the rule text
6. Pass through additional HTML attributes
7. Implement in HTML headless (plain HTML)
8. Implement in Svelte headless (Svelte 5 + runes)
9. Implement in React headless (React 19 + TypeScript with status union type)
10. Implement in Vue headless (Vue 3 + TypeScript)
11. Implement in Nunjucks headless (macro)
12. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="validation-list-item"
- [ ] data-status reflects the status prop
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
- [ ] Add CSS class .validation-list-item to css-style-sheet-template.css with [data-status] selectors
- [ ] Add comprehensive accessibility tests for status updates
- [ ] Add integration tests with parent ValidationList
