# StepList — Specification

Single source of truth for spec-driven development of the StepList component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the StepList component: an ordered list of step items showing progress through a multi-step process.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .step-list

## Approach

1. Use semantic <ol> element with class="step-list"
2. Apply aria-label when the label prop is provided
3. Apply data-current when the current prop is provided
4. Pass through additional attributes
5. Implement in HTML headless (plain HTML)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="step-list"
- [ ] Applies aria-label and data-current when provided
- [ ] Children (step-list-item) render in order
- [ ] Pass-through attributes are forwarded to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS classes beyond the base class plus consumer extras
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
- [ ] Add CSS class .step-list to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with step-list-item children
